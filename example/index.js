import { readRootDir, mkDir, deleteDir } from '../dist/index'

window.addEventListener('load', () => {
    mkDir('images', { type: 0, size: 0 })
        .then(() => {
            console.info('mkdir done!');
            return readRootDir({ type: 0, size: 0 })
        })
        .then(dirs => {
            console.info(dirs);
            alert(dirs.length);
        })
});