import { DOMFileSystem } from './interface';

const nativeRequestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
export const TEMPORARY = 0;
export const PERSISTENT = 1;

export const requestTemporaryFileSystem = (size: number): Promise<DOMFileSystem> => {
    return new Promise((resolve, reject) => {
        navigator.webkitTemporaryStorage.requestQuota(
            size,
            (grantedBytes: number) => {
                console.info(`remaining temporary storage space is ${grantedBytes} bytes`);

                nativeRequestFileSystem(
                    TEMPORARY,
                    grantedBytes,
                    (fs: DOMFileSystem) => {
                        resolve(fs);
                    },
                    (e: Error) => {
                        reject(`requestTemporaryFileSystem Failed：${e.message}`);
                    }
                )
            },
            (e: Error) => {
                reject(`navigator.webkitTemporaryStorage.requestQuota Failed: ${e.message}`)
            }
        );
    });
}

export const requestPersistentFileSystem = (size: number): Promise<DOMFileSystem> => {
    return new Promise((resolve, reject) => {
        navigator.webkitPersistentStorage.requestQuota(
            size,
            (grantedBytes: number) => {
                console.info(`remaining persistent storage space is ${grantedBytes} bytes`);

                nativeRequestFileSystem(
                    PERSISTENT,
                    grantedBytes,
                    (fs: DOMFileSystem) => {
                        resolve(fs);
                    },
                    (e: Error) => {
                        reject(`requestPersistentFileSystem Failed：${e.message}`);
                    }
                )
            },
            (e: Error) => {
                console.error(`navigator.webkitPersistentStorage.requestQuota Failed: ${e.message}`)
            }
        );
    });
}