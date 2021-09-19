import { RequestFileSystemConfig, DOMFileSystem, DirectoryEntry, RemoveDirConfig } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const deleteDir = async (
    path: string,
    {
        type = TEMPORARY,
        size = 0
    }: RequestFileSystemConfig = {
        type: TEMPORARY,
        size: 0
    },
    {
        recursive = false
    }: RemoveDirConfig = {
        recursive: false
    }
): Promise<void> => {
    if (type !== TEMPORARY && type !== PERSISTENT) {
        return Promise.reject('[deleteDir] requestFSConfig.type is incorrect');
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
