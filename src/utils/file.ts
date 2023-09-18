import fs from 'fs';
import path from 'path';
import logger from '../logger';

export const deleteFile = async (filepath: string) => {

    // Ignore missing file
    const opts = { force: true };

    return new Promise<void>((resolve, reject) => {
        fs.rm(filepath, opts, (err) => {
            if (err) reject(err);
    
            resolve();
        });
    });
}

export const readFile = (filepath: string, encoding: BufferEncoding = 'utf-8') => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filepath, { encoding }, (err, data) => {
            if (err) reject(err);

            logger.trace(`Read ${data.length} bytes from file: ${filepath}`);

            resolve(data);
        });
    });
}

export const writeFile = async (filepath: string, data: string | Buffer, encoding: BufferEncoding = 'utf-8') => {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filepath, data, { encoding }, (err) => {
            if (err) reject(err);
    
            resolve();
        });
    });
}

export const touchFile = async (filepath: string) => {
    const exists = fs.existsSync(filepath);

    if (!exists) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });

        // New file generated
        return true;
    }

    // No new file generated
    return false;
}

export const readJSON = async (filepath: string) => {
    return JSON.parse(await readFile(filepath));
}

export const writeJSON = async (filepath: string, data: any) => {
    await writeFile(filepath, JSON.stringify(data, undefined, 2));
}