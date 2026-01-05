import express, { Request, Response } from "express";
import { AuthRepository } from "../../module/auth/entity/auth.entity";
import { Admin } from "../../config/database/models/Admin";
import { User } from "../../config/database/models/User";
import { AuthService } from "../../module/auth/services/auth.service";
import { validate } from "../../module/middleware/validate";
import { AuthDto } from "../../module/auth/dto/auth.dto";
import { authMiddleware } from "../../module/middleware/auth";
import { AppError } from "../../utils/app-error";
import { LoginSchema, RegisterSchema } from "./validation";


export const auth = express.Router()
const authRepository = new AuthRepository(Admin, User)
const authService = new AuthService(authRepository)


auth.post("/login/admin", validate(LoginSchema), async (req: Request, res: Response) => {
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

auth.post("/login/user", validate(LoginSchema), async (req: Request, res: Response) => {
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

auth.post("/register/admin", validate(RegisterSchema), async (req: Request, res: Response) => {
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

auth.get("/me", authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = req.user
        res.status(200).json(user)
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