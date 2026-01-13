import express, { Request, Response, NextFunction } from "express";
import { AdminRepository } from "../../module/admin/entity/admin.entity";
import { AdminService } from "../../module/admin/services/admin.service";
import { Test } from "../../config/database/models/Exam";
import { Option } from "../../config/database/models/Option";
import { Question } from "../../config/database/models/Question";
import { User } from "../../config/database/models/User";
import { AppError } from "../../utils/app-error";
import { CreateExamType } from "../../module/admin/dto/create-exam.dto";
import { CreateOptionType } from "../../module/admin/dto/create-option.dto";
import { CreateQuestionType } from "../../module/admin/dto/create-question.dto";
import { authMiddleware, roleMiddleware } from "../../module/middleware/auth";
import { Role } from "../../module/auth/services/auth.service";
import { TestResult } from "../../config/database/models/ExamResult";
import { UpdateQuestionType } from "../../module/admin/dto/update-question.dto";
import { Position } from "../../config/database/models/Position";
import { UpdateExamType } from "../../module/admin/dto/update-exam.dto";
import { UpdateAccountType } from "../../module/admin/dto/update-account.dto";
import { ExamAccounts } from "../../config/database/models/ExamAccounts";



export const admin = express.Router()

const adminRepository = new AdminRepository(User, Test, Option, Question, TestResult, Position, ExamAccounts)
const adminService = new AdminService(adminRepository)

admin.use(authMiddleware(adminService))

admin.get("/accounts", async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllUserAccount()
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

admin.get("/accounts/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const user = await adminService.findUserAccountByID(id)
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

admin.post("/accounts", async (req: Request, res: Response) => {
    try {
        const { name, email, positionId } = req.body
        await adminService.getPositionById(positionId)
        const user = await adminService.createUserAccount(name, email, positionId)
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

admin.patch("/accounts/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const { name, email, position } = req.body
        const payload: UpdateAccountType = {
            name,
            email,
            position
        }
        const updatedUser = await adminService.updateAccount(id, payload)
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

admin.get("/exams", async (req: Request, res: Response) => {
    try {
        const exams = await adminService.getAllExams()
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

admin.post("/exams", async (req: Request, res: Response) => {
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
        const exam = await adminService.createExam(payload)
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

admin.get("/questions/:questionId/options", async (req: Request, res: Response) => {
    const questionId = req.params.questionId
    try {
        const options = await adminService.getOptionsByQuestionID(questionId)
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

admin.get("/exams/:examId/questions", async (req: Request, res: Response) => {
    try {
        const examId = req.params.examId
        const exam = await adminService.getQuestionWithOptions(examId)
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

admin.get("/exams/:examId", async (req: Request, res: Response) => {
    try {
        const examId = req.params.examId
        const exam = await adminService.findExamByID(examId)
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


admin.get("/exams/candidates/results", async (req: Request, res: Response) => {
    try {
        const results = await adminService.getResults()
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


admin.patch("/exams/:examId", async (req: Request, res: Response) => {
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
        const updatedExam = await adminService.updateExam(examId, payload);
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

admin.patch("/questions/:id", async (req: Request, res: Response) => {
    try {
        const questionId = req.params.id
        const { text } = req.body
        const payload: UpdateQuestionType = {
            text
        }
        const updatedQuestion = await adminService.updateQuestion(questionId, payload)
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

admin.patch("/options/:id", async (req: Request, res: Response) => {
    try {
        const optionId = req.params.id
        const { text, isCorrect } = req.body
        const updatedOption = await adminService.updateOption(optionId, text, isCorrect)
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

admin.delete("/questions/:id", async (req: Request, res: Response) => {
    try {
        const questionId = req.params.id
        await adminService.deleteQuestion(questionId)
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

admin.delete("/options/:id", async (req: Request, res: Response) => {
    try {
        const optionId = req.params.id
        await adminService.deleteOption(optionId)
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


admin.get("/positions", async (req: Request, res: Response) => {
    try {
        const positions = await adminService.getAllPositions()
        res.status(200).json({
            success: true,
            data: positions
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

admin.get("/positions/:id", async (req: Request, res: Response) => {
    try {
        const positionId = req.params.id
        const position = await adminService.getPositionById(positionId)
        res.status(200).json({
            success: true,
            data: position
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

admin.post("/positions", async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const position = await adminService.createPosition(name)
        res.status(200).json({
            success: true,
            data: position
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

admin.delete("/positions/:id", async (req: Request, res: Response) => {
    try {
        const positionId = req.params.id
        await adminService.deletePositionById(positionId)
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

admin.patch("/positions/:id", async (req: Request, res: Response) => {
    try {
        const positionId = req.params.id
        const { name } = req.body
        const updatedPosition = await adminService.updatePositionById(positionId, name)
        res.status(200).json({
            success: true,
            data: updatedPosition
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

admin.post("/accounts/invitation", roleMiddleware(Role.ADMIN), async (req: Request, res: Response) => {
    try {
        const { examId, userIds } = req.body
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "userIds harus berupa array dan tidak boleh kosong"
            });
        }
        const invitation = await adminService.sendInvitation(examId, userIds)
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
