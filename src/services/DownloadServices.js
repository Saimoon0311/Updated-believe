import {FileSystem, Dirs} from 'react-native-file-access';

/**
 * The getFileExtension function extracts the file extension from a given URL.
 **/
const getFileExtension = url =>
  url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));

/**
 * The function `getUrlExtention` takes a filename as input and returns its file extension.
 * @returns The function `getUrlExtention` returns the file extension of the given filename.
 **/
const getUrlExtention = filename => {
  // To get the file extension
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
};

/**
 * The function `cacheMedia` fetches a media file from a given URL and saves it in the cache directory,
 * while providing progress updates through a callback function.
 * @param url - The `url` parameter is the URL of the media file that you want to cache. It could be an
 * image, video, audio, or any other type of media file.
 * @param callBack - The `callBack` parameter is a function that will be called once the media file has
 * been fetched and saved to the cache directory. It can be used to perform any additional actions or
 * logic after the file has been cached.
 * @returns The `cacheMedia` function is returning the result of the `FileSystem.fetchManaged` function
 * call.
 **/
const cacheMedia = (url, callBack) => {
  return FileSystem.fetchManaged(
    url,
    {
      path: Dirs.CacheDir + '/' + getFileExtension(url),
    },
    (onProgress = e => console.log(e)),
  );
};

const getCacheMedia = url =>
  FileSystem.stat(Dirs.CacheDir + '/' + getFileExtension(url));

export const hashMedia = path => FileSystem.hash(path, 'SHA-256');

export const hasDownloaded = path => FileSystem.exists(path);

/**
 * The function `deleteFiles` checks if a file exists at the given filepath and deletes it if it does.
 **/
const deleteFiles = async filepath => {
  FileSystem.exists(filepath)
    .then(async result => {
      console.log('file exists: ', result);

      if (result) {
        return (
          FileSystem.unlink(filepath)
            .then(() => {
              console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch(err => {
              console.log(err.message);
            })
        );
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

/**
 * The function `deleteAllFiles` is an asynchronous function that takes a file path as input and
 * deletes all the files at the specified path.
 * @returns The function `deleteAllFiles` returns a promise.
 **/
const deleteAllFiles = async filepath => {
  return new Promise(async (resolve, reject) => {
    try {
      const allMap = filepath.map(async res => {
        const exist = await FileSystem.exists(res);
        if (exist) {
          const unlinkFiles = await FileSystem.unlink(res);
          console.log('file deleted', unlinkFiles);
        } else console.log('file not exists');
      });
      await Promise.all(allMap);
      resolve({folderCreated: true, error: null});
    } catch (error) {
      console.log('err', error);
      reject({folderCreated: false, error: error?.message || error});
    }
  });
};

// export {createFolders, cancelDownload, deleteFiles};
export {
  deleteFiles,
  getUrlExtention,
  cacheMedia,
  getCacheMedia,
  deleteAllFiles,
};

// export const fileDownloader = async (
//   fileUrl,
//   filePath,
//   getPregress,
//   getTaskData,
// ) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await checkPermission();
//       await createFolders();
//       const {path} = await downloadFile(
//         fileUrl,
//         filePath,
//         getPregress,
//         getTaskData,
//       );
//       resolve({ok: true, path});
//     } catch (error) {
//       reject({ok: false});
//     }
//   });
// };
