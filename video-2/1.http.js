const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    if (req.url == '/') {
        res.statusCode = 200
        res.end('<h1>Bienvenido en mi página de inicio.</h1>')
    } else if (req.url == '/contacto') {
        res.statusCode = 200
        res.end('<h1>Contacto</h1>')
    } else if (req.url == '/imagen-super-bonita.png') {
        fs.readFile('./white-cat.jpg', (err, data) => {
            if (err) {
                console.log(err)
                res.statusCode = 500
                res.end('<h1>500 Internal Server Error</h1>')
            } else {
                res.setHeader('Content-type', 'image/png')
                res.end(data)
            }
        })
    }
    else {
        res.statusCode = 400 // not found
        res.end('<h1>404</h1>')
    }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
    console.log(`server listening on port http://localhost:${desiredPort}`)
})
