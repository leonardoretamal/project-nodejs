const http = require('node:http')
const { findAvailablePort } = require('./10.free-port')

const port = process.env.PORT ?? 3000

const server = http.createServer((req, res) => {
    console.log('request received')
    res.end('Hola mundo.')
})

findAvailablePort(1234).then(port => {
    console.log(`server listening on port http://localhost:${port}`)
})
