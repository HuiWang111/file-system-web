// eslint-disable-next-line @typescript-eslint/no-var-requires
import { readRootDir } from '../dist/index'

window.addEventListener('load', () => {
    const fileInput = document.querySelector('#upload');

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
        })
});