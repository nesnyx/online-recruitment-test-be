import { Sequelize } from "sequelize";
import { ENV } from "../env";

export const sequelize = new Sequelize({
    database: ENV.DB_NAME,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    host: "localhost",
    port: 5432,
    dialect: 'postgres',
    pool: {
        max: 9,        
        min: 0,         
        acquire: 30000, 
        idle: 10000     
    }
});