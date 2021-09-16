(function () {
  'use strict';

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

  // eslint-disable-next-line @typescript-eslint/no-var-requires

  window.addEventListener('load', () => {
      document.querySelector('#upload');

      // fileInput.addEventListener('change', (e) => {
      //     for (const file of e.target.files) {
      //         writeFile(file.name, file, {
      //             size: file.size,
      //             type: 0
      //         }).then(a => {
      //             console.log(a)
      
      //             readFile(file.name, {
      //                 size: file.size,
      //                 type: 0
      //             }).then(content => {
      //                 const f = new File([content], file.name);
      //                 console.log(f);
      //             })
      //         })
              
      //         readFile(file.name, {
      //             size: file.size,
      //             type: 0
      //         }).then(content => {
      //             console.log(content)
      //             const f = new File([content], file.name);
      //             console.log(f);
      //         })
      //     }
      // })
      
      // mkDir('images', { type: 0, size: 1000 })
      //     .then(() => {
      //         console.log('mkdir done!');
      //     })
      readRootDir({ type: 0, size: 1000 })
          .then(dirs => {
              console.info(dirs);
              alert(dirs.length);
          });
  });

}());
