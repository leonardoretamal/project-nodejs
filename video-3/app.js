const express = require('express') // requiere -> commonJS
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')


const app = express()
app.use(express.json())
app.disable('x-powered-by') //deshabilitar el header x-powered-by: express

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/DELETE/PATCH

// CORS PRE-Flight
// OPTIONS

const ACCEPTED_ORIGINS = [
    'http://127.0.0.1:5500',
    'http://movies.com',
]
// Todos los recursos que sean MOVIES se identifican con /movies
app.get('/movies', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
    }


    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp
    const { id } = req.params
    const movie = movies.find(movie => movie.id == id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) { // Cambiado a result.success
        return res.status(400).json({
            error: JSON.parse(result.error.message)
        })
    }

    // en base de datos
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data // usar ... solamente cuando esta validado.
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
    }


    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id == id)

    if (movieIndex == -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted successfully' })

})

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json(
            { error: JSON.parse(result.error.message) }
        )
    }

    const movieIndex = movies.findIndex(movie => movie.id == id)

    if (movieIndex == -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)

})

app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH')
    }
    res.send(200)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})