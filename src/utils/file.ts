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

export const readFile = (filepath: string, options = { encoding: 'utf-8' as BufferEncoding }) => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filepath, options, (err, data) => {
            if (err) reject(err);

            logger.trace(`Read ${data.length} bytes from file: ${filepath}`);

            resolve(data);
        });
    });
}

export const writeFile = async (filepath: string, data: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => {
            if (err) reject(err);
    
            resolve();
        });
    });
}

export const appendToFile = async (filepath: string, data: string) => {
    return new Promise<void>((resolve, reject) => {
        fs.open(filepath, 'a+', (openErr, file) => {
            if (openErr) reject(openErr);

            fs.write(file, data, (writeErr) => {
                if (writeErr) reject(writeErr);

                fs.close(file, (closeErr) => {
                    if (closeErr) reject(closeErr);

                    logger.trace(`Wrote ${data.length} bytes to file: ${filepath}`);

                    resolve();
                });
            });
        });
    });
}

export const touchFile = async (filepath: string) => {
    const exists = fs.existsSync(filepath);

    if (!exists) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        
        await createFile(filepath);

        // New file generated
        return true;
    }

    // No new file generated
    return false;
}

export const createFile = async (filepath: string) => {
    await writeFile(filepath, '');
}

export const readJSON = async (filepath: string) => {
    return JSON.parse(await readFile(filepath));
}

export const writeJSON = async (filepath: string, data: any) => {
    await writeFile(filepath, JSON.stringify(data));
}