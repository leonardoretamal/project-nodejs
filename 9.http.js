const http = require('node:http')

const server = http.createServer((req, res) => {
    console.log('request received')
    res.end('Hola mundo.')
})

// El puerto 0 escoge un puerto disponible
// no recomendable para producción.
server.listen(0, () => {
    console.log(`server listening on port http://localhost:${server.address().port}`)
})