import express, { Request, Response } from "express"
import { authMiddleware, roleMiddleware } from "../../modules/middleware/auth"
import { Role } from "../../modules/auth/services/auth.service"
import { AppError } from "../../utils/app-error"
import { adminExamAccountService, userService } from "../../container"



export const user = express.Router()




user.use(authMiddleware(adminExamAccountService), roleMiddleware(Role.USER))
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
        console.log(error)
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


user.get("/me", async (req: Request, res: Response) => {
    res.status(200).json({
        data: req.user
    })
})
