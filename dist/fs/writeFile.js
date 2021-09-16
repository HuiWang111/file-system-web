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
export const writeFile = (file, content, requestFSConfig, { append = false } = {
    append: false
}) => __awaiter(void 0, void 0, void 0, function* () {
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
        fs.root.getFile(file, {
            create: !append
        }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
                fileWriter.onwriteend = () => {
                    resolve();
                };
                fileWriter.onerror = (e) => {
                    reject(`writeFile Failed：${e.message}`);
                };
                if (content instanceof Blob) {
                    fileWriter.write(content);
                }
                else {
                    const blob = new Blob([content], {
                        type: 'text/plain'
                    });
                    fileWriter.write(blob);
                }
            }, (e) => {
                reject(`writeFile Failed：${e.message}`);
            });
        }, (e) => {
            reject(`writeFile Failed：${e.message}`);
        });
    });
});
