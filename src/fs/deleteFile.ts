import { RequestFileSystemConfig, DOMFileSystem, FileEntry } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const deleteFile = async (
    file: string,
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
        fs!.root.getFile(
            file,
            {
                create: false
            },
            (fileEntry: FileEntry) => {
                fileEntry.remove(
                    () => {
                        resolve();
                    },
                    (e: Error) => {
                        reject(`deleteFile Failed：${e.message}`);
                    }
                )
            },
            (e: Error) => {
                reject(`deleteFile Failed：${e.message}`);
            }
        )
    });
}
