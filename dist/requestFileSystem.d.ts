import { DOMFileSystem } from './interface';
export declare const TEMPORARY = 0;
export declare const PERSISTENT = 1;
export declare const requestTemporaryFileSystem: (size: number) => Promise<DOMFileSystem>;
export declare const requestPersistentFileSystem: (size: number) => Promise<DOMFileSystem>;
