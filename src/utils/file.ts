import fs from 'fs';
import path from 'path';
import logger from '../logger';
import checkDiskSpace from 'check-disk-space';
import { DISK_SPACE_MIN } from '../config/file';
import { promisify } from 'util';

const fsRm = promisify(fs.rm);
const fsReadDir = promisify(fs.readdir);
const fsReadFile = promisify(fs.readFile);
const fsWriteFile = promisify(fs.writeFile);



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

    return fsRm(filepath, opts);
}

export const readFile = async (filepath: string, encoding: BufferEncoding = 'utf-8') => {
    const data = await fsReadFile(filepath, { encoding });
    
    logger.trace(`Read ${data.length} bytes from file: ${filepath}`);

    return data;
}

export const writeFile = async (filepath: string, data: string | Buffer, touch: boolean = false, encoding: BufferEncoding = 'utf-8') => {
    if (touch) {
        touchFile(filepath);
    }

    return fsWriteFile(filepath, data, { encoding });
}

export const listFiles = (dir: string) => {
    return fsReadDir(dir);
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