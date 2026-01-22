import { Application } from "express";
import cors from 'cors';
import { urlencoded } from 'body-parser'
import * as rateLimit from 'express-rate-limit';
import express from 'express';
import { Sequelize } from "sequelize";
import "./config/database/models"
import { router } from "./routes";
import helmet from "helmet";
import morgan from "morgan"
import { ENV } from "./config/env";
import compression from "compression";
import { logger } from "./utils/logger";

export class ApplicationModule {
    constructor(public app: Application, public sequelize: Sequelize) {
        app.set('trust-proxy', true)
        app.use(helmet());
        app.use(cors({
            origin: ["https://rekrutmen.ridjstudio.cloud", "https://asseshub.vercel.app", "http://localhost:4400"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],

        }));
        app.use(rateLimit.default({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests from this IP, please try again after 15 minutes',
            standardHeaders: true,
            legacyHeaders: false,
        }));
        app.use(express.json())
        app.use(morgan((tokens: any, req: any, res: any) => {
            const status = tokens.status(req, res);
            const method = tokens.method(req, res);
            const statusColor = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
            const reset = '\x1b[0m';

            const logMessage = `${method} ${tokens.url(req, res)} ${statusColor}${status}${reset} ${tokens['response-time'](req, res)}ms`;

            logger.info(logMessage);
            return null;
        }));
        app.use(urlencoded({ extended: true }))
        app.use("/api/v1", router)
        app.use(compression());
    }

    async start() {
        const PORT = ENV.PORT
        await this.sequelize.authenticate()
        console.log('Database connection has been established successfully.')
        await this.sequelize.sync()
        console.log('Database synchronized successfully.')

        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
}