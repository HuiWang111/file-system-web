
interface DirectoryReader {
    readEntries: (
        successCallback: (result: FileEntry[]) => void,
        errorCallback: (e: Error) => void
    ) => void;
}

export interface GetDirectoryOptions {
    create?: boolean;
    exclusive?: boolean;
}

export interface FileWriter {
    error: Error | null;
    length: number;
    onabort: () => void | null;
    onerror: (error: Error) => void | null;
    onprogress: () => void | null;
    onwrite: () => void | null;
    onwriteend: () => void | null;
    onwritestart: () => void | null;
    write: (blob: Blob) => void;
    position: number;
    readyState: number;
    DONE: 2;
    INIT: 0;
    WRITING: 1;
}
    
export interface DirectoryEntry {
    filesystem: DOMFileSystem;
    fullPath: string;
    isDirectory: boolean;
    isFile: boolean;
    name: string;
    createReader: () => DirectoryReader;
    getDirectory: (
        path: string,
        options: GetDirectoryOptions,
        successCallback?: (dirEntry: DirectoryEntry) => void,
        errorCallback?: (e: Error) => void
    ) => void;
    getFile: (
        path: string,
        options: GetDirectoryOptions,
        successCallback?: (fileEntry: FileEntry) => void,
        errorCallback?: (e: Error) => void
    ) => void;
    remove: (
        successCallback: () => void,
        errorCallback?: (e: Error) => void
    ) => void;
    removeRecursively: (
        successCallback: () => void,
        errorCallback?: (e: Error) => void
    ) => void;
    // removeRecursively will Deprecated
}

export interface FileEntry extends Omit<DirectoryEntry, 'removeRecursively'> {
    file: (
        successCallback: (file: unknown) => void,
        errorCallback?: (e: Error) => void
    ) => void;
    createWriter: (
        successCallback: (fileWriter: FileWriter) => void,
        errorCallback?: (e: Error) => void
    ) => void;
}

export interface DOMFileSystem {
    readonly name: string;
    readonly root: DirectoryEntry;
}

export interface RequestFileSystemConfig {
    size: number;
    type: 0 | 1;
}

export interface WriteFileConfig {
    append?: boolean;
}

export interface RemoveDirConfig {
    recursive: boolean;
}

export interface FSInfoResult {
    currentUsageInBytes: number;
    currentQuotaInBytes: number;
}