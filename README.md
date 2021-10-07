# web-fs

## Reference
- [探索FileSystem Api](https://www.html5rocks.com/zh/tutorials/file/filesystem//)
- [MDN FileSystem](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem)
- [How to use navigator instead of window.webkitStorageInfo HTML5 File-system API?](https://stackoverflow.com/questions/17809824/how-to-use-navigator-instead-of-window-webkitstorageinfo-html5-file-system-api)

## Install
```bash
npm i file-system-web
# or
yarn add file-system-web
```

## Usage
```ts
import { readFile } from 'file-system-web';

async function main() {
    const fileContent = await readFile('1.txt');
    console.log(fileContent);
}
```

## API

### interfaces
- RequestFileSystemConfig
```ts
interface RequestFileSystemConfig {
    size?: number;
    type?: 0 | 1;
}
```
- DirectoryEntry
```ts
interface DirectoryEntry {
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
```
- FileEntry
```ts
interface FileEntry extends Omit<DirectoryEntry, 'removeRecursively'> {
    file: (
        successCallback: (file: unknown) => void,
        errorCallback?: (e: Error) => void
    ) => void;
    createWriter: (
        successCallback: (fileWriter: FileWriter) => void,
        errorCallback?: (e: Error) => void
    ) => void;
}
```
- WriteFileConfig
```ts
interface WriteFileConfig {
    append?: boolean; // 是否追加内容
}
```
- RemoveDirConfig
```ts
interface RemoveDirConfig {
    recursive?: boolean; // 是否递归删除
}
```
- FSInfoResult
```ts
interface FSInfoResult {
    currentUsageInBytes: number; // 当前已使用字节数
    currentQuotaInBytes: number; // 当前配额字节数
}
```

### defaultValues
- RequestFileSystemConfig
```ts
const defaultConfig = {
    size: 0,
    type: 0
}
```
- WriteFileConfig
```ts
const defaultWriteFileConfig = {
    append: false
}
```
- RemoveDirConfig
```ts
const defaultRemoveDirConfig = {
    recursive: false
}
```


### `1. readFile(file: string, config?: RequestFileSystemConfig): Promise<string | ArrayBuffer | null>`

### `2. createFile(file: string, config?: RequestFileSystemConfig): Promise<FileEntry>`

### `3. deleteFile(file: string, config?: RequestFileSystemConfig): Promise<void>`

### `4. writeFile(file: string, content: string | Blob | File, config?: RequestFileSystemConfig, writeFileConfig?: WriteFileConfig): Promise<void>`

### `5. mkdir(dirname: string, config?: RequestFileSystemConfig): Promise<void>`

### `6. readRootDir(config?: RequestFileSystemConfig): Promise<FileEntry[]>`

### `7. deleteDir(path: string, config?: RequestFileSystemConfig, removeDirConfig?: RemoveDirConfig)`

### `8. getFSInfo(type?: 0 | 1): Promise<FSInfoResult>`