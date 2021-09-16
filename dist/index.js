// src/requestFileSystem.ts
var nativeRequestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
var TEMPORARY = 0;
var PERSISTENT = 1;
var requestTemporaryFileSystem = (size) => {
  return new Promise((resolve, reject) => {
    navigator.webkitTemporaryStorage.requestQuota(size, (grantedBytes) => {
      console.info(`remaining temporary storage space is ${grantedBytes} bytes`);
      nativeRequestFileSystem(TEMPORARY, grantedBytes, (fs) => {
        resolve(fs);
      }, (e) => {
        reject(`requestTemporaryFileSystem Failed\uFF1A${e.message}`);
      });
    }, (e) => {
      reject(`navigator.webkitTemporaryStorage.requestQuota Failed: ${e.message}`);
    });
  });
};
var requestPersistentFileSystem = (size) => {
  return new Promise((resolve, reject) => {
    navigator.webkitPersistentStorage.requestQuota(size, (grantedBytes) => {
      console.info(`remaining persistent storage space is ${grantedBytes} bytes`);
      nativeRequestFileSystem(PERSISTENT, grantedBytes, (fs) => {
        resolve(fs);
      }, (e) => {
        reject(`requestPersistentFileSystem Failed\uFF1A${e.message}`);
      });
    }, (e) => {
      console.error(`navigator.webkitPersistentStorage.requestQuota Failed: ${e.message}`);
    });
  });
};

// src/fs/createFile.ts
var createFile = async (file, requestFSConfig) => {
  if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
    return Promise.reject("requestFSConfig.type is incorrect");
  }
  let fs;
  let requestFSError;
  try {
    if (requestFSConfig.type === TEMPORARY) {
      fs = await requestTemporaryFileSystem(requestFSConfig.size);
    } else {
      fs = await requestPersistentFileSystem(requestFSConfig.size);
    }
  } catch (e) {
    requestFSError = e;
  }
  if (!fs) {
    return Promise.reject(requestFSError);
  }
  return new Promise((resolve, reject) => {
    fs.root.getFile(file, { create: true, exclusive: true }, (fileEntry) => {
      resolve(fileEntry);
    }, (e) => {
      reject(`createFile Failed\uFF1A${e.message}`);
    });
  });
};

// src/fs/readFile.ts
var readFile = async (file, requestFSConfig) => {
  if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
    return Promise.reject("requestFSConfig.type is incorrect");
  }
  let fs;
  let requestFSError;
  try {
    if (requestFSConfig.type === TEMPORARY) {
      fs = await requestTemporaryFileSystem(requestFSConfig.size);
    } else {
      fs = await requestPersistentFileSystem(requestFSConfig.size);
    }
  } catch (e) {
    requestFSError = e;
  }
  if (!fs) {
    return Promise.reject(requestFSError);
  }
  return new Promise((resolve, reject) => {
    fs.root.getFile(file, {}, (fileEntry) => {
      fileEntry.file((file2) => {
        const reader = new FileReader();
        reader.onload = function() {
          resolve(reader.result);
        };
        reader.onerror = function() {
          var _a;
          reject(`readFile Failed\uFF1A${(_a = reader.error) == null ? void 0 : _a.message}`);
        };
        reader.readAsText(file2);
      }, (e) => {
        reject(`readFile Failed\uFF1A${e.message}`);
      });
    }, (e) => {
      reject(`readFile Failed\uFF1A${e.message}`);
    });
  });
};

// src/fs/writeFile.ts
var writeFile = async (file, content, requestFSConfig, {
  append = false
} = {
  append: false
}) => {
  if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
    return Promise.reject("requestFSConfig.type is incorrect");
  }
  let fs;
  let requestFSError;
  try {
    if (requestFSConfig.type === TEMPORARY) {
      fs = await requestTemporaryFileSystem(requestFSConfig.size);
    } else {
      fs = await requestPersistentFileSystem(requestFSConfig.size);
    }
  } catch (e) {
    requestFSError = e;
  }
  if (!fs) {
    return Promise.reject(requestFSError);
  }
  return new Promise((resolve, reject) => {
    fs.root.getFile(file, {
      create: !append
    }, (fileEntry) => {
      fileEntry.createWriter((fileWriter) => {
        fileWriter.onwriteend = () => {
          resolve();
        };
        fileWriter.onerror = (e) => {
          reject(`writeFile Failed\uFF1A${e.message}`);
        };
        if (content instanceof Blob) {
          fileWriter.write(content);
        } else {
          const blob = new Blob([content], {
            type: "text/plain"
          });
          fileWriter.write(blob);
        }
      }, (e) => {
        reject(`writeFile Failed\uFF1A${e.message}`);
      });
    }, (e) => {
      reject(`writeFile Failed\uFF1A${e.message}`);
    });
  });
};

// src/fs/deleteFile.ts
var deleteFile = async (file, requestFSConfig) => {
  if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
    return Promise.reject("requestFSConfig.type is incorrect");
  }
  let fs;
  let requestFSError;
  try {
    if (requestFSConfig.type === TEMPORARY) {
      fs = await requestTemporaryFileSystem(requestFSConfig.size);
    } else {
      fs = await requestPersistentFileSystem(requestFSConfig.size);
    }
  } catch (e) {
    requestFSError = e;
  }
  if (!fs) {
    return Promise.reject(requestFSError);
  }
  return new Promise((resolve, reject) => {
    fs.root.getFile(file, {
      create: false
    }, (fileEntry) => {
      fileEntry.remove(() => {
        resolve();
      }, (e) => {
        reject(`deleteFile Failed\uFF1A${e.message}`);
      });
    }, (e) => {
      reject(`deleteFile Failed\uFF1A${e.message}`);
    });
  });
};

// src/fs/mkDir.ts
var mkDir = async (dirname, requestFSConfig) => {
  if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
    return Promise.reject("requestFSConfig.type is incorrect");
  }
  let fs;
  let requestFSError;
  try {
    if (requestFSConfig.type === TEMPORARY) {
      fs = await requestTemporaryFileSystem(requestFSConfig.size);
    } else {
      fs = await requestPersistentFileSystem(requestFSConfig.size);
    }
  } catch (e) {
    requestFSError = e;
  }
  if (!fs) {
    return Promise.reject(requestFSError);
  }
  return new Promise((resolve, reject) => {
    fs.root.getDirectory(dirname, { create: true }, () => {
      resolve();
    }, (e) => {
      reject(`mkDir Failed: ${e.message}`);
    });
  });
};

// src/fs/readDir.ts
var readRootDir = async (requestFSConfig) => {
  if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
    return Promise.reject("requestFSConfig.type is incorrect");
  }
  let fs;
  let requestFSError;
  try {
    if (requestFSConfig.type === TEMPORARY) {
      fs = await requestTemporaryFileSystem(requestFSConfig.size);
    } else {
      fs = await requestPersistentFileSystem(requestFSConfig.size);
    }
  } catch (e) {
    requestFSError = e;
  }
  if (!fs) {
    return Promise.reject(requestFSError);
  }
  return new Promise((resolve, reject) => {
    const dirReader = fs.root.createReader();
    let entries = [];
    const readEntries = () => {
      dirReader.readEntries((result) => {
        if (!result.length) {
          resolve(entries);
        } else {
          entries = entries.concat(result);
          readEntries();
        }
      }, (e) => {
        reject(`readDir Failed: ${e.message}`);
      });
    };
    readEntries();
  });
};

// src/fs/deleteDir.ts
var deleteDir = async (path, requestFSConfig, {
  recursive = false
} = {
  recursive: false
}) => {
  if (requestFSConfig.type !== TEMPORARY && requestFSConfig.type !== PERSISTENT) {
    return Promise.reject("requestFSConfig.type is incorrect");
  }
  let fs;
  let requestFSError;
  try {
    if (requestFSConfig.type === TEMPORARY) {
      fs = await requestTemporaryFileSystem(requestFSConfig.size);
    } else {
      fs = await requestPersistentFileSystem(requestFSConfig.size);
    }
  } catch (e) {
    requestFSError = e;
  }
  if (!fs) {
    return Promise.reject(requestFSError);
  }
  return new Promise((resolve, reject) => {
    fs.root.getDirectory(path, {
      create: false
    }, (dirEntry) => {
      if (recursive) {
        dirEntry.removeRecursively(() => {
          resolve();
        }, (e) => {
          reject(`deleteDir Failed\uFF1A${e.message}`);
        });
      } else {
        dirEntry.remove(() => {
          resolve();
        }, (e) => {
          reject(`deleteDir Failed\uFF1A${e.message}`);
        });
      }
    }, (e) => {
      reject(`deleteDir Failed\uFF1A${e.message}`);
    });
  });
};
export {
  createFile,
  deleteDir,
  deleteFile,
  mkDir,
  readFile,
  readRootDir,
  writeFile
};
