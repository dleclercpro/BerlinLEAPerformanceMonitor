import TimeDuration from '../models/general/TimeDuration';

export const sleep = async (duration: TimeDuration) => {
    await new Promise(resolve => setTimeout(resolve, duration.toMs().getAmount()));
};