var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { requestPersistentFileSystem, requestTemporaryFileSystem, TEMPORARY, PERSISTENT } from '../requestFileSystem';
export const readFile = (file, requestFSConfig) => __awaiter(void 0, void 0, void 0, function* () {
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
        fs.root.getFile(file, {}, (fileEntry) => {
            fileEntry.file((file) => {
                const reader = new FileReader();
                reader.onload = function () {
                    resolve(reader.result);
                };
                reader.onerror = function () {
                    var _a;
                    reject(`readFile Failed：${(_a = reader.error) === null || _a === void 0 ? void 0 : _a.message}`);
                };
                reader.readAsText(file);
            }, (e) => {
                reject(`readFile Failed：${e.message}`);
            });
        }, (e) => {
            reject(`readFile Failed：${e.message}`);
        });
    });
});
