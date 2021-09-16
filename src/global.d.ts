import { DOMFileSystem } from './interface'

type RequestFileSystem = (
    type: Window["TEMPORARY"] | Window["PERSISTENT"],
    size: number,
    successCallback: (fs: DOMFileSystem) => void,
    errorCallback?: (e: Error) => void
) => void;

type RequestQuota = (
    type: Window["TEMPORARY"] | Window["PERSISTENT"],
    size: number
) => void;

interface DeprecatedStorageQuota {
    requestQuota: (
        requestedBytes: number,
        successCallback: (grantedBytes: number) => void,
        errorCallback?: (e: Error) => void
    ) => void;
    queryUsageAndQuota: (
        successCallback: (usedBytes: number, grantedBytes: number) => void,
        errorCallback?: (e: Error) => void
    ) => void;
}

declare global {
    interface Window {
        TEMPORARY: number;
        PERSISTENT: number;
        requestFileSystem?: RequestFileSystem;
        webkitRequestFileSystem: RequestFileSystem; 
    }

    interface Navigator {
        webkitTemporaryStorage: DeprecatedStorageQuota;
        webkitPersistentStorage: DeprecatedStorageQuota;
    }
}
