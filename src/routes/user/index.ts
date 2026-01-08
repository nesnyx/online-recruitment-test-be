import express, { Request, Response } from "express"
import { UserService } from "../../module/user/services/user.service"
import { UserRepository } from "../../module/user/entity/user.entity"
import { User } from "../../config/database/models/User"
import { Question } from "../../config/database/models/Question"
import { QuestionAnswer } from "../../config/database/models/QuestionAnswer"
import { TestResult } from "../../config/database/models/ExamResult"
import { AdminRepository } from "../../module/admin/entity/admin.entity"
import { Test } from "../../config/database/models/Exam"
import { Option } from "../../config/database/models/Option"
import { authMiddleware, roleMiddleware } from "../../module/middleware/auth"
import { Role } from "../../module/auth/services/auth.service"
import { AppError } from "../../utils/app-error"
import { sequelize } from "../../config/database/database"
import { Position } from "../../config/database/models/Position"

export const user = express.Router()

const userRepository = new UserRepository(User, QuestionAnswer, TestResult, Question, Test, Option)
const adminRepository = new AdminRepository(User, Test, Option, Question, TestResult, Position)
const userService = new UserService(userRepository, adminRepository)


user.use(authMiddleware, roleMiddleware(Role.USER))
user.get("/exam/:examId/status", async (req: Request, res: Response) => {
    const examId = req.params.examId
    try {
        const userId = req.user?.id
        if (!userId) throw new AppError("Unauthorized", 401)
        const checkStatus = await userService.checkStatusExamHappening(userId, examId)
        return res.status(200).json({
            status: "success",
            data: checkStatus
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

user.get("/exam/questions/answers", async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        if (!userId) throw new AppError("Unauthorized", 401)
        const questionsAnswer = await userService.findQuestionAnswerByUserId(userId)
        return res.status(200).json({
            status: "success",
            data: questionsAnswer
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


user.get("/exam/:examId/questions", async (req: Request, res: Response) => {
    try {
        const examId = req.params.examId
        const questions = await userService.findQuestionExam(examId)
        return res.status(200).json({
            status: "success",
            data: questions
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

user.post("/exam/:examId/question/answer", async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        if (!userId) throw new AppError("Unauthorized", 401)
        const { optionId, questionId } = req.body
        const questionAnswer = await userService.createOrUpdateQuestionAnswer(userId, optionId, questionId)
        return res.status(201).json({
            status: "success",
            data: questionAnswer
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


user.post("/exam/start", async (req: Request, res: Response) => {

    try {
        const userId = req.user?.id
        if (!userId) throw new AppError("Unauthorized", 401)
        const { examId } = req.body

        const examResult = await userService.startExam(userId, examId)

        return res.status(201).json({
            status: "success",
            data: examResult
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

user.post("/exam/submit", async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        if (!userId) throw new AppError("Unauthorized", 401)
        const { examId } = req.body
        const examResult = await userService.submitExam(userId, examId)
        return res.status(201).json({
            status: "success",
            data: examResult
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

