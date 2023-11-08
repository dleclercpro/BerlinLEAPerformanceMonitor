import { parseLogs } from '../../utils/parsing';
import { IGNORE_DAYS_WITH_EMPTY_BUCKETS } from '../../config';
import { LOGS_DIR, LOGS_FILEPATH } from '../../config/file';
import { ONE_HOUR } from '../../constants/times';
import { TimeUnit } from '../../types';
import TimeDuration from '../units/TimeDuration';
import ErrorDistributionOnWorkdaysGraph from '../graphs/ErrorDistributionOnWorkdaysGraph';
import EventPrevalenceOnWorkdaysGraph from '../graphs/EventPrevalenceOnWorkdaysGraph';
import SessionAverageLengthGraph from '../graphs/SessionAverageLengthGraph';
import SessionLengthGraph from '../graphs/SessionLengthGraph';
import SessionHistory from '../sessions/SessionHistory';
import SessionHistoryBuilder from '../sessions/SessionHistoryBuilder';
import Job from './Job';
import Release from '../Release';
import { listFiles } from '../../utils/file';
import logger from '../../logger';
import { flatten } from '../../utils/array';

interface Args {
    dir?: string,
    since?: Date | Release,
}

class AnalysisJob extends Job {
    protected dir: string;
    protected since?: Date | Release;

    public constructor(args: Args) {
        super();

        const { dir, since } = args;

        this.dir = dir ?? LOGS_DIR;
        this.since = since;
    }

    public async execute() {
        const logs = await this.getLogsToAnalyze();

        if (logs.length === 0) {
            logger.info(`No logs to analyze.`);
            return;
        } else if (this.since instanceof Release) {
            logger.info(`Analyzing logs since release ${this.since.toString()}...`);
        } else if (this.since instanceof Date) {
            logger.info(`Analyzing logs since ${this.since.toISOString()}...`);        
        } else {
            logger.info(`Analyzing logs since the beginning of time...`);        
        }

        const hourlyHistory = SessionHistoryBuilder.build(logs, ONE_HOUR);
        const biHourlyHistory = SessionHistoryBuilder.rebuildWithDifferentBucketSize(hourlyHistory, new TimeDuration(2, TimeUnit.Hours));
    
        await this.generateSessionLengthGraph(hourlyHistory);
        await this.generateSessionAverageLengthGraph(hourlyHistory);
        await this.generateEventPrevalenceOnWorkdaysGraph(biHourlyHistory);
        await this.generateErrorDistributionOnWorkdaysGraph(biHourlyHistory);

        hourlyHistory.summarize();
    }

    protected async getLogsToAnalyze() {
        const filenames = await listFiles(this.dir);
        
        const filepaths = filenames
            .map((filename: string) => `${LOGS_DIR}/${filename}`)
            .filter((filepath: string) => filepath !== LOGS_FILEPATH)
            .sort();

        // Add default output log file at the end (it's the most recent one)
        filepaths.push(LOGS_FILEPATH);

        const logsByFile = await Promise.all(filepaths.map((filepath: string) => parseLogs(filepath, this.since)));
        const logs = flatten(logsByFile);

        logger.info(`Found ${logs.length} logs to analyze.`);

        return logs;
    }

    protected async generateSessionLengthGraph(history: SessionHistory) {
        const graph = new SessionLengthGraph();
        await graph.draw(history);
        await graph.store();
    }

    protected async generateSessionAverageLengthGraph(history: SessionHistory) {
        const graph = new SessionAverageLengthGraph();
        await graph.draw(history, IGNORE_DAYS_WITH_EMPTY_BUCKETS);
        await graph.store();
    }

    protected async generateEventPrevalenceOnWorkdaysGraph(history: SessionHistory) {
        const graph = new EventPrevalenceOnWorkdaysGraph();
        await graph.draw(history);
        await graph.store();
    }

    protected async generateErrorDistributionOnWorkdaysGraph(history: SessionHistory) {
        const graph = new ErrorDistributionOnWorkdaysGraph();
        await graph.draw(history);
        await graph.store();
    }
}

export default AnalysisJob;