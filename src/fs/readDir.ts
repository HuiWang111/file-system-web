import { RequestFileSystemConfig, DOMFileSystem, FileEntry } from '../interface';
import {
    requestPersistentFileSystem,
    requestTemporaryFileSystem,
    TEMPORARY,
    PERSISTENT
} from '../requestFileSystem';

export const readRootDir = async (
    {
        type = TEMPORARY,
        size = 0
    }: RequestFileSystemConfig = {
        type: TEMPORARY,
        size: 0
    }
): Promise<FileEntry[]> => {
    if (type !== TEMPORARY && type !== PERSISTENT) {
        return Promise.reject('[readRootDir] requestFSConfig.type is incorrect');
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
        const dirReader = fs!.root.createReader();
        let entries: FileEntry[] = [];

        const readEntries = () => {
            dirReader.readEntries(
                (result: FileEntry[]) => {
                    if (!result.length) {
                        resolve(entries);
                    } else {
                        entries = entries.concat(result);
                        readEntries();
                    }
                },
                (e: Error) => {
                    reject(`readDir Failed: ${e.message}`);
                }
            );
        }

        readEntries();
    });
}