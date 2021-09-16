import { RequestFileSystemConfig } from '../interface';
export declare const readFile: (file: string, requestFSConfig: RequestFileSystemConfig) => Promise<string | ArrayBuffer | null>;
