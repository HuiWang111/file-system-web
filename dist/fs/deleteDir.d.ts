import { RequestFileSystemConfig, RemoveDirConfig } from '../interface';
export declare const deleteDir: (path: string, { type, size }?: RequestFileSystemConfig, { recursive }?: RemoveDirConfig) => Promise<void>;
