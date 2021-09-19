import { RequestFileSystemConfig, FileEntry } from '../interface';
export declare const readRootDir: ({ type, size }?: RequestFileSystemConfig) => Promise<FileEntry[]>;
