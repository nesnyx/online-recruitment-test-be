import express, { Request, Response, NextFunction } from "express";

import { adminQuestionService, adminOptionService } from "../../container";
import { CreateOptionType } from "../../modules/admin/dto/create-option.dto";
import { UpdateQuestionType } from "../../modules/admin/dto/update-question.dto";
import { AppError } from "../../utils/app-error";

export const question = express.Router()


question.delete("/:id", async (req: Request, res: Response) => {
    try {
        const questionId = req.params.id
        await adminQuestionService.deleteQuestion(questionId)
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
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})


question.patch("/:id", async (req: Request, res: Response) => {
    try {
        const questionId = req.params.id
        const { text } = req.body
        const payload: UpdateQuestionType = {
            text
        }
        const updatedQuestion = await adminQuestionService.updateQuestion(questionId, payload)
        res.status(200).json({
            success: true,
            data: updatedQuestion
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



question.post("/:questionId/options", async (req: Request, res: Response) => {
    const questionId = req.params.questionId
    try {
        const { isCorrect, text } = req.body
        const question = await adminQuestionService.findQuestionByID(questionId)
        const payload: CreateOptionType = {
            questionId: question.id,
            isCorrect,
            text
        }
        const option = await adminOptionService.createOption(payload)
        res.status(200).json(option)

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


question.get("/:questionId/options", async (req: Request, res: Response) => {
    const questionId = req.params.questionId
    try {
        const options = await adminOptionService.getOptionsByQuestionID(questionId)
        res.status(200).json({
            status: true,
            data: options
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