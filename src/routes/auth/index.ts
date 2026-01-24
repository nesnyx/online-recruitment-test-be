import express, { Request, Response } from "express";
import { AuthRepository } from "../../modules/auth/repository/auth.repository";
import { Admin } from "../../config/database/models/Admin";
import { User } from "../../config/database/models/User";
import { AuthService } from "../../modules/auth/services/auth.service";

import { AuthDto } from "../../modules/auth/dto/auth.dto";
import { authMiddleware } from "../../modules/middleware/auth";
import { AppError } from "../../utils/app-error";
import { adminExamAccountService, adminPositionService } from "../../container";
import { verifyMagicLoginToken } from "../../config/jwt";

import { ENV } from "../../config/env";




export const auth = express.Router()
const authRepository = new AuthRepository(Admin, User)
const authService = new AuthService(authRepository, adminPositionService)


auth.post("/login/admin", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const payload: AuthDto = {
            username,
            password
        }
        const admin = await authService.loginAdmin(payload)
        res.status(200).json({
            token: admin
        })
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

auth.post("/login/user", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const payload: AuthDto = {
            username,
            password
        }
        const user = await authService.loginUser(payload)
        res.status(200).json({
            token: user
        })
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

auth.post("/register/admin", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const payload: AuthDto = {
            username,
            password
        }
        const admin = await authService.registerAdmin(payload)
        res.status(200).json(admin)
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

auth.get("/me", authMiddleware(adminExamAccountService), async (req: Request, res: Response) => {
    try {
        const user = req.user
        return res.status(200).json(user)
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

auth.get("/magic-login", async (req: Request, res: Response) => {
    const { t } = req.query;
    try {
        const decoded = verifyMagicLoginToken(String(t));
        const payload: AuthDto = {
            username:decoded.username,
            password : decoded.password
        }
        const user = await authService.loginUser(payload)
        res.redirect(`${ENV.REDIRECT_URL_MAGIC_LOGIN}?token=${user}`);
    } catch (error: any) {
        if (error instanceof AppError) {
             res.redirect(`https://rekrutmen.ridjstudio.cloud/login?error=expired`);
        }
        res.redirect(`https://rekrutmen.ridjstudio.cloud/login?error=expired`);
    }
})