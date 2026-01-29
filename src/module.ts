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
import "./workers/exam.worker"


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
        adminEventListener.handleSendInvitationEvent();
        userEventListener.handleExamSubmittedEvent();
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