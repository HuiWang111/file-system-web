import { RequestFileSystemConfig, DOMFileSystem, DirectoryEntry, RemoveDirConfig } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const deleteDir = async (
    path: string,
    requestFSConfig: RequestFileSystemConfig,
    {
        recursive = false
    }: RemoveDirConfig = {
        recursive: false
    }
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
            path,
            {
                create: false
            },
            (dirEntry: DirectoryEntry) => {
                if (recursive) {
                    dirEntry.removeRecursively(
                        () => {
                            resolve();
                        },
                        (e: Error) => {
                            reject(`deleteDir Failed：${e.message}`);
                        }
                    );
                } else {
                    dirEntry.remove(
                        () => {
                            resolve();
                        },
                        (e: Error) => {
                            reject(`deleteDir Failed：${e.message}`);
                        }
                    )
                }
            },
            (e: Error) => {
                reject(`deleteDir Failed：${e.message}`);
            }
        )
    });
}
