const { readFile } = require('node:fs/promises');

// IIFE - Immediately Invoked Function Expression

(
    async () => {
        console.log('Leyendo el primer archivo...')
        const text = await readFile('./archivo.txt', 'utf-8')
        console.log('Primer archivo: ', text)

        console.log('hacer cosas mientras lee el archivo...')

        console.log('Leyendo el segundo archivo...')
        const text2 = await readFile('./archivo2.txt', 'utf-8')
        console.log('Segundo texto: ', text2)
    }
)()
