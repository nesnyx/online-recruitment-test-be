import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    GMAIL_APP_EMAIL: process.env.GMAIL_APP_EMAIL,
    DB_NAME : process.env.DB_NAME,
    DB_USERNAME:process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD
};

if (!ENV.JWT_ACCESS_SECRET || !ENV.JWT_REFRESH_SECRET) {
    throw new Error("Kritikal Error: JWT_SECRET belum didefinisikan di file .env");
}