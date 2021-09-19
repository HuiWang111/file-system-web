import { RequestFileSystemConfig, DOMFileSystem, FileEntry } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const readFile = async (
    file: string,
    {
        type = TEMPORARY,
        size = 0
    }: RequestFileSystemConfig = {
        type: TEMPORARY,
        size: 0
    }
): Promise<string | ArrayBuffer | null> => {
    if (type !== TEMPORARY && type !== PERSISTENT) {
        return Promise.reject('[readFile] requestFSConfig.type is incorrect');
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
