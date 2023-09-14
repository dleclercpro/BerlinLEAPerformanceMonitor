import os from 'os';
import { exec } from 'child_process';
import logger from '../logger';

class SoundPlayer {
    private silent: boolean = os.platform() !== 'darwin';
    private cmd: string = 'afplay'; // This command only exists on OS X systems

    public async play(filepath: string) {
        if (this.silent) {
            logger.trace(`Sound player will be silent.`);
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

export default SoundPlayer;