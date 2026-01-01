import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    NODE_ENV: process.env.NODE_ENV || "development"
};

// Validasi saat startup
if (!ENV.JWT_ACCESS_SECRET || !ENV.JWT_REFRESH_SECRET) {
    throw new Error("Kritikal Error: JWT_SECRET belum didefinisikan di file .env");
}