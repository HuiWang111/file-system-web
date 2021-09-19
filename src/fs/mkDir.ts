import { RequestFileSystemConfig, DOMFileSystem } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const mkDir = async (
    dirname: string,
    {
        type = TEMPORARY,
        size = 0
    }: RequestFileSystemConfig = {
        type: TEMPORARY,
        size: 0
    }
): Promise<void> => {
    if (type !== TEMPORARY && type !== PERSISTENT) {
        return Promise.reject('[mkDir] requestFSConfig.type is incorrect');
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
        fs!.root.getDirectory(
            dirname,
            { create: true },
            () => {
                resolve();
            },
            (e: Error) => {
                reject(`mkDir Failed: ${e.message}`);
            }
        )
    });
}