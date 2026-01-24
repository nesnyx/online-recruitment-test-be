import express, { Request, Response, NextFunction } from "express";
import { adminOptionService } from "../../container";
import { AppError } from "../../utils/app-error";



export const option = express.Router()


option.put("/:id", async (req: Request, res: Response) => {
    try {
        const optionId = req.params.id
        const { text, isCorrect } = req.body
        const updatedOption = await adminOptionService.updateOption(optionId, text, isCorrect)
        res.status(200).json({
            success: true,
            data: updatedOption
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


option.delete("/:id", async (req: Request, res: Response) => {
    try {
        const optionId = req.params.id
        await adminOptionService.deleteOption(optionId)
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
