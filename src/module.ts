import { Application } from "express";
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import express from 'express';
import { Sequelize } from "sequelize";
import "./config/database/models"
import { router } from "./routes";
import morgan from "morgan"
import { ENV } from "./config/env";
export class ApplicationModule {
    constructor(public app: Application, public sequelize: Sequelize) {
        app.set('trust-proxy', true)
        app.use(cors({
            origin: "*"
        }))
        app.use(express.json())
        app.use(morgan("dev"))
        app.use(urlencoded({ extended: true }))
        app.use("/api/v1", router)
        Object.setPrototypeOf(this, ApplicationModule.prototype)
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