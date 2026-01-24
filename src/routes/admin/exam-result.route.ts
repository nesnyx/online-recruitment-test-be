import express, { Request, Response, NextFunction } from "express";
import { adminResultService } from "../../container";
import { AppError } from "../../utils/app-error";


export const examResult = express.Router()

examResult.get("/exams/candidates/results", async (req: Request, res: Response) => {
    try {
        const results = await adminResultService.getResults()
        res.status(200).json({
            success: true,
            data: results
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