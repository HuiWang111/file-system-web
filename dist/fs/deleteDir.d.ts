import { RequestFileSystemConfig, RemoveDirConfig } from '../interface';
export declare const deleteDir: (path: string, requestFSConfig: RequestFileSystemConfig, { recursive }?: RemoveDirConfig) => Promise<void>;
