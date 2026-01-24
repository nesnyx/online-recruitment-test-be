import express, { Request, Response, NextFunction } from "express";
import { adminExamService, adminQuestionService } from "../../container";
import { CreateExamType } from "../../modules/admin/dto/create-exam.dto";
import { CreateQuestionType } from "../../modules/admin/dto/create-question.dto";
import { UpdateExamType } from "../../modules/admin/dto/update-exam.dto";
import { AppError } from "../../utils/app-error";

export const exam = express.Router()

exam.get("/", async (req: Request, res: Response) => {
    try {
        const exams = await adminExamService.getAllExams()
        res.status(200).json({
            success: true,
            data: exams
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

exam.post("/", async (req: Request, res: Response) => {
    try {
        const { title, description, startAt, endAt, durationMinutes, categoryId } = req.body
        const payload: CreateExamType = {
            title,
            description,
            startAt,
            endAt,
            durationMinutes,
            categoryId
        }
        const exam = await adminExamService.createExam(payload)
        res.status(200).json(exam)
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




exam.post("/:examId/questions", async (req: Request, res: Response) => {
    const examId = req.params.examId
    try {
        const { text } = req.body
        const exam = await adminExamService.findExamByID(examId)
        const payload: CreateQuestionType = {
            testId: exam.id,
            text
        }
        const question = await adminQuestionService.createQuestion(payload)
        res.status(200).json({
            data: question,
            succes: true,
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

exam.get("/:examId/questions", async (req: Request, res: Response) => {
    try {
        const examId = req.params.examId
        const exam = await adminQuestionService.getQuestionWithOptions(examId)
        res.status(200).json({
            data: exam,
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

exam.get("/:examId", async (req: Request, res: Response) => {
    try {
        const examId = req.params.examId
        const exam = await adminExamService.findExamByID(examId)
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





exam.patch("/:examId", async (req: Request, res: Response) => {
    try {
        const examId = req.params.examId
        const payload: UpdateExamType = {
            title: req.body.title,
            durationMinutes: req.body.durationMinutes,
            description: req.body.description,
            category: req.body.categoryId,
            startAt: req.body.startAt,
            endAt: req.body.endAt,
        }
        const updatedExam = await adminExamService.updateExam(examId, payload);
        res.status(200).json({
            success: true,
            data: updatedExam
        });
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




exam.delete("/:examId", async (req: Request, res: Response) => {
    const { examId } = req.params
    try {
        const deleted = await adminExamService.deleteExamById(examId)
        res.status(200).json({
            success: true,
            data: deleted
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