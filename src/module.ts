import { Application } from "express";
import { urlencoded } from 'body-parser'
import express from 'express';
import { Sequelize } from "sequelize";
import "./config/database/models"
import { router } from "./routes";
import helmet from "helmet";
import { ENV } from "./config/env";
import compression from "compression";
import { adminEventListener, userEventListener } from "./container";
import { corsMiddleware } from "./modules/middleware/cors";
import { logging } from "./modules/middleware/logging";
import { logger } from "./utils/logger";
import { examWorker } from "./workers/container.worker";


export class ApplicationModule {
    constructor(public app: Application, public sequelize: Sequelize) {
        app.set('trust-proxy', true)
        app.use(helmet());
        app.use(corsMiddleware);
        app.use(express.json())
        app.use(logging);
        app.use(urlencoded({ extended: true }))
        app.use("/api/v1", router)
        app.use(compression());
    }

    async start() {
        const PORT = ENV.PORT
        try {
            await this.sequelize.authenticate();
            logger.info('Database connection established.');
            if (ENV.NODE_ENV !== 'production') {
                await this.sequelize.sync();
            }
            adminEventListener.handleSendInvitationEvent();
            userEventListener.handleExamSubmittedEvent();
            await examWorker.submitExamWorker();
            this.app.listen(PORT, () => {
                logger.info(`Server is running on port ${PORT}`);
            });
        } catch (error) {
            logger.error("Failed to start application", error);
            process.exit(1);
        }
    }
}