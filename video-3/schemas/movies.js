const z = require('zod')

// Definir el enum de géneros primero para reutilización
const genreEnum = z.enum([
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance',
    'Sci-Fi', 'Documentary', 'Thriller', 'Animation',
    'Adventure', 'Fantasy', 'Mystery', 'Crime', 'Musical', 'War'
])

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required' // Corregido: required_error
    }),
    year: z.number().int().positive().min(1900).max(2026),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(0), // Agregado .default(0) para evitar undefined
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(genreEnum, {
        required_error: 'Movie genre is required',
        invalid_type_error: 'Movie genre must be an array of strings'
    })
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(input) {
    return movieSchema.partial().safeParse(input)
}
//partial hace opcional todo, pero si esta la valida como debe ser.

module.exports = { validateMovie, validatePartialMovie }