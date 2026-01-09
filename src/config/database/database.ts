import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite", // path file SQLite
    dialectOptions: {
        // Meminta SQLite menunggu sampai 5000ms jika database sedang locked
        connectTimeout: 5000
    },
    query: {
        // Membantu menangani antrean query
        retry: {
            max: 5 // Coba lagi sampai 5 kali jika gagal karena locked
        }
    },
    logging: false, // true kalau mau lihat query SQL
});


sequelize.query('PRAGMA journal_mode=WAL;');