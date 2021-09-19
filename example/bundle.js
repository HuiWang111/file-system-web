(function () {
    'use strict';

    const nativeRequestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    const TEMPORARY = 0;
    const PERSISTENT = 1;
    const requestTemporaryFileSystem = (size) => {
        return new Promise((resolve, reject) => {
            navigator.webkitTemporaryStorage.requestQuota(size, (grantedBytes) => {
                console.info(`remaining temporary storage space is ${grantedBytes} bytes`);
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
    const requestPersistentFileSystem = (size) => {
        return new Promise((resolve, reject) => {
            navigator.webkitPersistentStorage.requestQuota(size, (grantedBytes) => {
                console.info(`remaining persistent storage space is ${grantedBytes} bytes`);
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

    (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    var __awaiter$1 = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const mkDir = (dirname, requestFSConfig) => __awaiter$1(void 0, void 0, void 0, function* () {
        if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
            return Promise.reject('requestFSConfig.type is incorrect');
        }
        let fs;
        let requestFSError;
        try {
            if (requestFSConfig.type === TEMPORARY) {
                fs = yield requestTemporaryFileSystem(requestFSConfig.size);
            }
            else {
                fs = yield requestPersistentFileSystem(requestFSConfig.size);
            }
        }
        catch (e) {
            requestFSError = e;
        }
        if (!fs) {
            return Promise.reject(requestFSError);
        }
        return new Promise((resolve, reject) => {
            fs.root.getDirectory(dirname, { create: true }, () => {
                resolve();
            }, (e) => {
                reject(`mkDir Failed: ${e.message}`);
            });
        });
    });

    var __awaiter = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const readRootDir = (requestFSConfig) => __awaiter(void 0, void 0, void 0, function* () {
        if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
            return Promise.reject('requestFSConfig.type is incorrect');
        }
        let fs;
        let requestFSError;
        try {
            if (requestFSConfig.type === TEMPORARY) {
                fs = yield requestTemporaryFileSystem(requestFSConfig.size);
            }
            else {
                fs = yield requestPersistentFileSystem(requestFSConfig.size);
            }
        }
        catch (e) {
            requestFSError = e;
        }
        if (!fs) {
            return Promise.reject(requestFSError);
        }
        return new Promise((resolve, reject) => {
            const dirReader = fs.root.createReader();
            let entries = [];
            const readEntries = () => {
                dirReader.readEntries((result) => {
                    if (!result.length) {
                        resolve(entries);
                    }
                    else {
                        entries = entries.concat(result);
                        readEntries();
                    }
                }, (e) => {
                    reject(`readDir Failed: ${e.message}`);
                });
            };
            readEntries();
        });
    });

    (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    window.addEventListener('load', () => {
        mkDir('images', { type: 0, size: 0 })
            .then(() => {
                console.info('mkdir done!');
                return readRootDir({ type: 0, size: 0 })
            })
            .then(dirs => {
                console.info(dirs);
                alert(dirs.length);
            });
    });

}());
