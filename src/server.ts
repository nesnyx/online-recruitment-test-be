import express from "express";
import { ApplicationModule } from "./module";
import { sequelize } from "./config/database/database";
import dotenv from 'dotenv';
dotenv.config();
const bootstrap = () => {
    const app = new ApplicationModule(express(), sequelize);
    app.start();
}

bootstrap();
