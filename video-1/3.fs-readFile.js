const fs = require('node:fs')

console.log('Leyendo el primer archivo...')
fs.readFile('./archivo.txt', 'utf-8', (err, text) => { // ejecutas este callback cuando termine
    console.log('Primer texto: ', text)
}) // forma asíncrona con callback

console.log('hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo...')
fs.readFile('./archivo2.txt', 'utf-8', (err, text) => {
    console.log('Segundo texto: ', text)
})
