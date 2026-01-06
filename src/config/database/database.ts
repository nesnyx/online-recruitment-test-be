import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite", // path file SQLite
    logging: false, // true kalau mau lihat query SQL
});
