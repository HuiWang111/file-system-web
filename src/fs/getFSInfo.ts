import { FSInfoResult } from '../interface'
import { TEMPORARY, PERSISTENT } from '../requestFileSystem'

export const getFSInfo = async (type: 0 | 1 = 0): Promise<FSInfoResult> => {
    return new Promise((resolve, reject) => {
        if (type !== TEMPORARY && type !== PERSISTENT) {
            return Promise.reject('[getFSInfo] type is incorrect');
        }

        if (type === TEMPORARY) {
            navigator.webkitTemporaryStorage.queryUsageAndQuota(
                (currentUsageInBytes: number, currentQuotaInBytes: number) => {
                    resolve({
                        currentUsageInBytes,
                        currentQuotaInBytes
                    })
                },
                (e: Error) => {
                    reject(`getFSInfo Failed：${e.message}`)
                }
            )
        } else {
            navigator.webkitPersistentStorage.queryUsageAndQuota(
                (currentUsageInBytes: number, currentQuotaInBytes: number) => {
                    resolve({
                        currentUsageInBytes,
                        currentQuotaInBytes
                    })
                },
                (e: Error) => {
                    reject(`getFSInfo Failed：${e.message}`)
                }
            )
        }
    });
}