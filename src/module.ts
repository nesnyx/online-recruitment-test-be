import { Application } from "express";
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { Sequelize } from "sequelize";
import "./config/database/models"
import { router } from "./routes";
import morgan from "morgan"
export class ApplicationModule {
    constructor(public app: Application, public sequelize: Sequelize) {
        app.set('trust-proxy', true)
        app.use(cors())
        app.use(morgan("dev"))
        app.use(json())
        app.use("/api/v1", router)
        app.use(urlencoded({ extended: true }))
        Object.setPrototypeOf(this, ApplicationModule.prototype)
    }

    async start() {
        const PORT = 3002
        await this.sequelize.authenticate()
        console.log('Database connection has been established successfully.')
        await this.sequelize.sync()
        console.log('Database synchronized successfully.')

        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
}