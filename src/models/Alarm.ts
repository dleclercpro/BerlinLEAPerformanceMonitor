import os from 'os';
import { exec } from 'child_process';
import logger from '../logger';
import { ALARM_PATH } from '../config';

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

    public async ringAlarm() {
        await this.play(ALARM_PATH);
    }

    public async testAlarm() {
        logger.trace(`Testing alarm...`);
        await this.play(ALARM_PATH);
        logger.trace(`Alarm tested.`);
    }

    protected async play(filepath: string) {
        if (this.silent) {
            logger.trace(`Sound player will be silent: only works on OS X.`);
            return;
        }

        logger.trace(`Play sound file '${filepath}'...`);
        
        return new Promise<void>((resolve, reject) => {
            exec(`${this.cmd} ${filepath}`, (err) => {
                if (err) reject(err);
    
                logger.trace(`Played sound.`);

                resolve();
            });
        });
    }
}

export default Alarm.getInstance();