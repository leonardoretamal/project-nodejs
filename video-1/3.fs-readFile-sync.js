const fs = require('node:fs')

console.log('Leyendo el primer archivo...')
const text = fs.readFileSync('./archivo.txt', 'utf-8')
console.log('Primer texto: ', text)

console.log('hacer cosas mientras lee el archivo...')

console.log('Leyendo el segundo archivo...')
const text2 = fs.readFileSync('./archivo2.txt', 'utf-8')
console.log('Segundo texto: ', text2)
