import { RequestFileSystemConfig } from '../interface';
export declare const readFile: (file: string, { type, size }?: RequestFileSystemConfig) => Promise<string | ArrayBuffer | null>;
