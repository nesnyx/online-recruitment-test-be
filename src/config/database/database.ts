import { Sequelize } from "sequelize";
import { ENV } from "../env";

export const sequelize = new Sequelize({
    database: ENV.DB_NAME,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    host:"localhost",
    dialect:'postgres'
});
