const express = require('express') // requiere -> commonJS

const app = express()
app.disable('x-powered-by') //deshabilitar el header x-powered-by: express

app.get('/', (req, res) => {
    res.json({ message: 'Hola mundo' })
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})