import { RequestFileSystemConfig, FileEntry } from '../interface';
export declare const createFile: (file: string, { type, size }?: RequestFileSystemConfig) => Promise<FileEntry>;
