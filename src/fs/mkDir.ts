import { RequestFileSystemConfig, DOMFileSystem } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const mkDir = async (
    dirname: string,
    requestFSConfig: RequestFileSystemConfig
): Promise<void> => {
    if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
        return Promise.reject('requestFSConfig.type is incorrect');
    }

    let fs: DOMFileSystem | undefined;
    let requestFSError: string | undefined;

    try {
        if (requestFSConfig.type === TEMPORARY) {
            fs = await requestTemporaryFileSystem(requestFSConfig.size);
        } else {
            fs = await requestPersistentFileSystem(requestFSConfig.size);
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