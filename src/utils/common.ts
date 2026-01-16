import os from 'os';
import path from 'path';

export const logDirectory: string =
    process.env.NODE_ENV === 'development'
        ? path.resolve('logs')
        : path.resolve(process.env.ERROR_LOGS_PATH || os.homedir());

export const convertToArray = async (
    fileType: string | string[],
): Promise<string[]> => {
    if (typeof fileType === 'string') {
        return fileType.split(',').map((item) => item.trim());
    }
    return fileType; // If already an array, return as is
};
