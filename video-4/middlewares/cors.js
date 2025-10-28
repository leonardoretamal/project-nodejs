import cors from 'cors';

export const corsMiddleware = () => cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:8080',
            'http://localhost:1234',
            'https://movies.com',
        ]

        if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
            return callback(null, true)
        }

        return callback(new Error('Origin not allowed by CORS'))
    }
})