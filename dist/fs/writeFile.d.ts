import { RequestFileSystemConfig, WriteFileConfig } from '../interface';
export declare const writeFile: (file: string, content: string | Blob | File, { type, size }?: RequestFileSystemConfig, { append }?: WriteFileConfig) => Promise<void>;
