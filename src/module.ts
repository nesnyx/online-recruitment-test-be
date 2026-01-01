import { Application } from "express";
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

export class ApplicationModule {
    constructor(public app: Application) {
        app.set('trust-proxy', true)
        app.use(cors())
        app.use(json())
        app.use(urlencoded({ extended: true }))
        Object.setPrototypeOf(this, ApplicationModule.prototype)
    }

    async start() {
        const PORT = 3002
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
}