import { Sequelize } from "sequelize"
import { Test } from "../../../config/database/models/Exam"

import { AppError } from "../../../utils/app-error"
import { CreateExamType } from "../dto/create-exam.dto"
import { UpdateExamType } from "../dto/update-exam.dto"
import { Position } from "../../../config/database/models/Position"

export interface IExam {
    createExam(payload: CreateExamType): Promise<Test>
    findAllExams(): Promise<Test[]>
    findExamByID(id: string): Promise<Test>
    updateExamById(id: string, payload: UpdateExamType): Promise<Test>
    
    deleteExamById(id: string): Promise<boolean>
}

export class AdminExamRepository implements IExam {
    constructor(private readonly exam: typeof Test, private readonly position: typeof Position) { }
    async updateExamById(id: string, payload: UpdateExamType): Promise<Test> {
        const exam = await this.exam.findByPk(id)
        if (!exam) {
            throw new AppError('Exam not found', 404)
        }
        return await exam.update({
            title: payload.title,
            durationMinutes: payload.durationMinutes,
            description: payload.description,
            category: payload.category,
            startAt: payload.startAt,
            endAt: payload.endAt,
        })
    }

    async deleteExamById(id: string): Promise<boolean> {
        const exam = await this.exam.findByPk(id)
        if (!exam) {
            throw new AppError('Exam not found', 404)
        }
        await exam.destroy()
        return true
    }


    async findAllExams(): Promise<Test[]> {
        return await this.exam.findAll({
            attributes: [
                'id',
                'title',
                'durationMinutes',
                'description',
                'startAt',
                'endAt',
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM questions
                        WHERE questions.testId = Test.id
                    )`),
                    'totalQuestions'
                ]
            ],
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: this.position,

                    attributes: ['name']
                }
            ]
        });
    }

    async findExamByID(id: string): Promise<Test> {
        const exam = await this.exam.findByPk(id)
        if (!exam) {
            throw new AppError('Exam not found', 404)
        }
        return exam
    }


    async createExam(payload: CreateExamType): Promise<Test> {
        return await this.exam.create({
            title: payload.title,
            description: payload.description,
            durationMinutes: payload.durationMinutes,
            startAt: payload.startAt,
            endAt: payload.endAt,
            category: payload.categoryId
        })
    }

}