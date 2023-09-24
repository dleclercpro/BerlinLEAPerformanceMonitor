import os from 'os';
import { exec } from 'child_process';
import logger from '../logger';
import { ALARM_FILEPATH } from '../config/file';

class Alarm {
    private static instance?: Alarm;

    private silent: boolean = os.platform() !== 'darwin';
    private cmd: string = 'afplay'; // This command only exists on OS X systems

    private constructor() {

    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Alarm();
        }
        return this.instance;
    }

    public async ring() {
        await this.play(ALARM_FILEPATH);
    }

    protected async play(filepath: string) {
        if (this.silent) {
            logger.trace(`Sound player will be silent: only works on OS X.`);
            return;
        }

        logger.trace(`Play sound file '${filepath}'...`);
        
        return new Promise<void>((resolve, reject) => {
            exec(`${this.cmd} ${filepath}`, (err) => {
                if (err) {
                    return reject(err);
                }
    
                logger.trace(`Played sound.`);

                resolve();
            });
        });
    }
}

export default Alarm.getInstance();