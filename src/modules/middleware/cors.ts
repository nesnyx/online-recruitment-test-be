import cors from 'cors';

export const corsMiddleware = cors({
    origin: ["https://rekrutmen.ridjstudio.cloud", "https://asseshub.vercel.app", "http://localhost:4400"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],

})