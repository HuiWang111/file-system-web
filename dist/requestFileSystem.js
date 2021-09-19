const nativeRequestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
export const TEMPORARY = 0;
export const PERSISTENT = 1;
export const requestTemporaryFileSystem = (size) => {
    return new Promise((resolve, reject) => {
        navigator.webkitTemporaryStorage.requestQuota(size, (grantedBytes) => {
            nativeRequestFileSystem(TEMPORARY, grantedBytes, (fs) => {
                resolve(fs);
            }, (e) => {
                reject(`requestTemporaryFileSystem Failed：${e.message}`);
            });
        }, (e) => {
            reject(`navigator.webkitTemporaryStorage.requestQuota Failed: ${e.message}`);
        });
    });
};
export const requestPersistentFileSystem = (size) => {
    return new Promise((resolve, reject) => {
        navigator.webkitPersistentStorage.requestQuota(size, (grantedBytes) => {
            nativeRequestFileSystem(PERSISTENT, grantedBytes, (fs) => {
                resolve(fs);
            }, (e) => {
                reject(`requestPersistentFileSystem Failed：${e.message}`);
            });
        }, (e) => {
            console.error(`navigator.webkitPersistentStorage.requestQuota Failed: ${e.message}`);
        });
    });
};
