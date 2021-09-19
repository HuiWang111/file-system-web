var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TEMPORARY, PERSISTENT } from '../requestFileSystem';
export const getFSInfo = (type = 0) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (type !== TEMPORARY && type !== PERSISTENT) {
            return Promise.reject('[getFSInfo] type is incorrect');
        }
        if (type === TEMPORARY) {
            navigator.webkitTemporaryStorage.queryUsageAndQuota((currentUsageInBytes, currentQuotaInBytes) => {
                resolve({
                    currentUsageInBytes,
                    currentQuotaInBytes
                });
            }, (e) => {
                reject(`getFSInfo Failed：${e.message}`);
            });
        }
        else {
            navigator.webkitPersistentStorage.queryUsageAndQuota((currentUsageInBytes, currentQuotaInBytes) => {
                resolve({
                    currentUsageInBytes,
                    currentQuotaInBytes
                });
            }, (e) => {
                reject(`getFSInfo Failed：${e.message}`);
            });
        }
    });
});
