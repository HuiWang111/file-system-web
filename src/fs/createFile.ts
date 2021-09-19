import { RequestFileSystemConfig, DOMFileSystem, FileEntry } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const createFile = async (
    file: string,
    {
        type = TEMPORARY,
        size = 0
    }: RequestFileSystemConfig = {
        type: TEMPORARY,
        size: 0
    }
): Promise<FileEntry> => {
    if (type !== TEMPORARY && type !== PERSISTENT) {
        return Promise.reject('[createFile] requestFSConfig.type is incorrect');
    }

    let fs: DOMFileSystem | undefined;
    let requestFSError: string | undefined;

    try {
        if (type === TEMPORARY) {
            fs = await requestTemporaryFileSystem(size);
        } else {
            fs = await requestPersistentFileSystem(size);
        }
    } catch (e) {
        requestFSError = e;
    }

    if (!fs) {
        return Promise.reject(requestFSError);
    }

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fs!.root.getFile(
            file,
            { create: true, exclusive: true },
            (fileEntry: FileEntry) => {
                resolve(fileEntry);
            },
            (e: Error) => {
                reject(`createFile Failed：${e.message}`);
            }
        )
    });
}