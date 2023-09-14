import { exec } from 'child_process';
import logger from '../logger';

class SoundPlayer {
    private cmd: string = 'afplay';
    
    public async play(filepath: string) {
        logger.debug(`Playing sound file '${filepath}'...`);
        
        return new Promise<void>((resolve, reject) => {
            exec(`${this.cmd} ${filepath}`, (err) => {
                if (err) reject(err);
    
                logger.debug(`Played sound.`);

                resolve();
            });
        });
    }
}

export default SoundPlayer;