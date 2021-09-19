import { RequestFileSystemConfig, DOMFileSystem, FileEntry, WriteFileConfig, FileWriter } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

/**
 * append = false 创建空白文件（如果该文件不存在），并在文件中写入内容
 * append = true 在已存在的文件中追加内容，如果文件不存在则报错
 */
export const writeFile = async (
    file: string,
    content: string | Blob | File,
    {
        type = TEMPORARY,
        size = 0
    }: RequestFileSystemConfig = {
        type: TEMPORARY,
        size: 0
    },
    {
        append = false
    }: WriteFileConfig = {
        append: false
    }
): Promise<void> => {
    if (type !== TEMPORARY && type !== PERSISTENT) {
        return Promise.reject('[writeFile] requestFSConfig.type is incorrect');
    }

    let fs: DOMFileSystem | undefined;
    let requestFSError: string | undefined;

    try {
        if (type === TEMPORARY) {
            fs = await requestTemporaryFileSystem(size);
        } else {
            fs = await requestPersistentFileSystem(size);
        }
    } catch (e) {
        requestFSError = e;
    }

    if (!fs) {
        return Promise.reject(requestFSError);
    }

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fs!.root.getFile(
            file,
            {
                create: !append
            },
            (fileEntry: FileEntry) => {
                fileEntry.createWriter(
                    (fileWriter: FileWriter) => {
                        fileWriter.onwriteend = () => {
                            resolve();
                        }

                        fileWriter.onerror = (e: Error) => {
                            reject(`writeFile Failed：${e.message}`);
                        }

                        if (content instanceof Blob) {
                            fileWriter.write(content);
                        } else {
                            const blob = new Blob([content], {
                                type: 'text/plain'
                            });
                            fileWriter.write(blob);
                        }
                    },
                    (e: Error) => {
                        reject(`writeFile Failed：${e.message}`);
                    }
                )
            },
            (e: Error) => {
                reject(`writeFile Failed：${e.message}`);
            }
        )
    });
}
