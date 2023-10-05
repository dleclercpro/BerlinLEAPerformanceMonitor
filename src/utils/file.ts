import fs from 'fs';
import path from 'path';
import logger from '../logger';
import checkDiskSpace from 'check-disk-space';
import { DISK_SPACE_MIN } from '../config/file';

export const verifyDiskSpace = async (requiredDiskSpace: number = DISK_SPACE_MIN) => {
    const { free } = await checkDiskSpace(path.resolve('/'));
    const hasEnoughDiskSpace = free / Math.pow(10, 9) >= requiredDiskSpace;

    if (!hasEnoughDiskSpace) {
        throw new Error('Not enough disk space to continue.');
    }
}

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

export const listFiles = (dir: string) => {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err);

            resolve(files);
        });
    });
}

export const doesFileExist = (filepath: string) => {
    return fs.existsSync(filepath);
}

export const touchFile = async (filepath: string) => {
    if (!doesFileExist(filepath)) {
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

export const writeJSON = async (filepath: string, data: string | Buffer) => {
    await writeFile(filepath, JSON.stringify(data, undefined, 2));
}