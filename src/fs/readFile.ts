import { RequestFileSystemConfig, DOMFileSystem, FileEntry } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const readFile = async (
    file: string,
    requestFSConfig: RequestFileSystemConfig
): Promise<string | ArrayBuffer | null> => {
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
            {},
            (fileEntry: FileEntry) => {
                fileEntry.file(
                    (file: Blob) => {
                        const reader = new FileReader();

                        reader.onload = function() {
                            resolve(reader.result);
                        }

                        reader.onerror = function() {
                            reject(`readFile Failed：${reader.error?.message}`);
                        }

                        reader.readAsText(file);
                    },
                    (e: Error) => {
                        reject(`readFile Failed：${e.message}`);
                    }
                )
            },
            (e: Error) => {
                reject(`readFile Failed：${e.message}`);
            }
        )
    });
}
