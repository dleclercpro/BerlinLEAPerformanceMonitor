import { EVERY_ONE_MINUTE, EVERY_THIRTY_MINUTES } from '../../constants/times';
import Job from './Job';

class GenerateGraphsJob extends Job {

    public constructor(expression?: string) {
        super(expression ?? EVERY_ONE_MINUTE);
    }

    public execute() {

    }
}

export default GenerateGraphsJob;