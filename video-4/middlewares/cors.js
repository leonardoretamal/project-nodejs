import cors from 'cors';

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:1234',
    'https://movies.com',
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {

        if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
            return callback(null, true)
        }

        return callback(new Error('Origin not allowed by CORS'))
    }
})