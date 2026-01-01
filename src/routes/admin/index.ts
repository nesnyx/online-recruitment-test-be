import express, { Request, Response } from "express";
import { AdminRepository } from "../../module/admin/entity/admin.entity";
import { AdminService } from "../../module/admin/services/admin.service";
import { Test } from "../../config/database/models/Exam";
import { Option } from "../../config/database/models/Option";
import { Question } from "../../config/database/models/Question";
import { User } from "../../config/database/models/User";
import { AppError } from "../../utils/app-error";
import { CreateAccountType } from "../../module/admin/dto/create-account.dto";
import { CreateExamType } from "../../module/admin/dto/create-exam.dto";
import { CreateOptionType } from "../../module/admin/dto/create-option.dto";
import { CreateQuestionType } from "../../module/admin/dto/create-question.dto";

export const admin = express.Router()

const adminRepository = new AdminRepository(User, Test, Option, Question)
const adminService = new AdminService(adminRepository)


admin.post("/accounts", async (req: Request, res: Response) => {
    try {
        const { name, password, email } = req.body
        const payload: CreateAccountType = {
            name,
            password,
            email
        }
        const user = await adminService.createUserAccount(payload)
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

admin.get("/accounts/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const user = await adminService.findUserAccountByID(id)
        res.status(200).json(user)
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


admin.post("/exams", async (req: Request, res: Response) => {
    try {
        const { title, description, startAt, endAt, durationMinutes } = req.body
        const payload: CreateExamType = {
            title,
            description,
            startAt,
            endAt,
            durationMinutes
        }
        const exam = await adminService.createExam(payload)
        res.status(200).json(exam)
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

admin.post("/questions/:questionId/options", async (req: Request, res: Response) => {
    const questionId = req.params.questionId
    try {
        const { isCorrect, text } = req.body
        const question = await adminService.findQuestionByID(questionId)
        const payload: CreateOptionType = {
            questionId: question.id,
            isCorrect,
            text
        }
        const option = await adminService.createOption(payload)
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

admin.post("/exams/:examId/questions", async (req: Request, res: Response) => {
    const examId = req.params.examId
    try {
        const { text } = req.body
        const exam = await adminService.findExamByID(examId)
        const payload: CreateQuestionType = {
            testId: exam.id,
            text
        }
        const question = await adminService.createQuestion(payload)
        res.status(200).json(question)
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