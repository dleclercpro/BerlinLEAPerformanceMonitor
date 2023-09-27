import { parseLogs } from '../../utils/parsing';
import { IGNORE_DAYS_WITH_EMPTY_BUCKETS } from '../../config';
import { LOGS_FILEPATH } from '../../config/file';
import { ONE_HOUR } from '../../constants/times';
import { TimeUnit } from '../../types';
import TimeDuration from '../TimeDuration';
import ErrorLikelihoodOnWorkdaysGraph from '../graphs/ErrorLikelihoodOnWorkdaysGraph';
import EventPrevalenceOnWorkdaysGraph from '../graphs/EventPrevalenceOnWorkdaysGraph';
import SessionAverageLengthGraph from '../graphs/SessionAverageLengthGraph';
import SessionLengthGraph from '../graphs/SessionLengthGraph';
import SessionHistory from '../sessions/SessionHistory';
import SessionHistoryBuilder from '../sessions/SessionHistoryBuilder';
import Job from './Job';

interface Args {
    filepath: string,
    since?: Date,
}

class AnalysisJob extends Job {
    protected filepath: string;
    protected since?: Date;

    public constructor(args: Args = { filepath: LOGS_FILEPATH }) {
        super();

        const { filepath, since } = args;

        this.filepath = filepath;
        this.since = since;
    }

    public async execute() {
        const logs = await parseLogs(this.filepath, this.since);
    
        const hourlyHistory = SessionHistoryBuilder.build(logs, ONE_HOUR);
        const biHourlyHistory = SessionHistoryBuilder.rebuildWithDifferentBucketSize(hourlyHistory, new TimeDuration(2, TimeUnit.Hours));
    
        await this.generateSessionLengthGraph(hourlyHistory);
        await this.generateSessionAverageLengthGraph(hourlyHistory);
        await this.generateEventPrevalenceOnWorkdaysGraph(biHourlyHistory);
        await this.generateErrorLikelihoodOnWorkdaysGraph(biHourlyHistory);
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

    protected async generateErrorLikelihoodOnWorkdaysGraph(history: SessionHistory) {
        const graph = new ErrorLikelihoodOnWorkdaysGraph();
        await graph.draw(history);
        await graph.store();
    }
}

export default AnalysisJob;