
import express, { Request, Response, NextFunction } from "express";
import { adminUserService, adminPositionService, sendInvitation } from "../../container";
import { UpdateAccountType } from "../../modules/admin/dto/update-account.dto";
import { Role } from "../../modules/auth/services/auth.service";
import { roleMiddleware } from "../../modules/middleware/auth";
import { AppError } from "../../utils/app-error";

export const account = express.Router()

account.get("/", async (req: Request, res: Response) => {
    try {
        const users = await adminUserService.getAllUserAccount()
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

account.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const user = await adminUserService.findUserAccountByID(id)
        res.status(200).json({
            "username": user.name,
            "email": user.email,
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

account.post("/", async (req: Request, res: Response) => {
    try {
        const { name, email, positionId } = req.body
        await adminPositionService.getPositionById(positionId)
        const user = await adminUserService.createUserAccount(name, email, positionId)
        res.status(200).json({
            success: true,
            data: user,
            message: "User created successfully"
        })
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

account.patch("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const { name, email, position } = req.body
        const payload: UpdateAccountType = {
            name,
            email,
            position
        }
        const updatedUser = await adminUserService.updateAccount(id, payload)
        res.status(200).json({
            success: true,
            data: updatedUser
        })
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


account.delete("/:id", async (req: Request, res: Response) => {
    const accountId = req.params.id
    try {
        await adminUserService.deleteAccountById(accountId)
        res.status(200).json({
            success: true,
        })
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


account.post("/invitation", roleMiddleware(Role.ADMIN), async (req: Request, res: Response) => {
    try {
        const { examId, userIds } = req.body
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "userIds harus berupa array dan tidak boleh kosong"
            });
        }
        const invitation = await sendInvitation.sendInvitation(examId, userIds)
        res.status(200).json({
            success: true,
            data: invitation
        })
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