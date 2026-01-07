import { Op, Sequelize } from "sequelize"
import { Test } from "../../../config/database/models/Exam"
import { TestResult } from "../../../config/database/models/ExamResult"
import { Option } from "../../../config/database/models/Option"
import { Question } from "../../../config/database/models/Question"
import { User } from "../../../config/database/models/User"
import { AppError } from "../../../utils/app-error"
import { CreateAccountType } from "../dto/create-account.dto"
import { CreateExamType } from "../dto/create-exam.dto"
import { CreateOptionType } from "../dto/create-option.dto"
import { CreateQuestionType } from "../dto/create-question.dto"
import { UpdateExamType } from "../dto/update-exam.dto"
import { UpdateQuestionType } from "../dto/update-question.dto"
import { Position } from "../../../config/database/models/Position"

export interface IAdminRepository {
    findUserAccountByID(id: string): Promise<User>
    createUserAccount(payload: CreateAccountType): Promise<User>
    findAllUserAccount(): Promise<User[]>
    createExam(payload: CreateExamType): Promise<Test>
    findAllExams(): Promise<Test[]>
    findQuestionByID(id: string): Promise<Question>
    updateQuestionById(id: string, payload: UpdateQuestionType): Promise<Question>
    deleteQuestionById(id: string): Promise<boolean>
    findExamByID(id: string): Promise<Test>
    findOptionByQuestionID(id: string): Promise<Option[]>
    deleteOptionById(id: string): Promise<boolean>
    updateOptionById(id: string, text: string, isCorrect: boolean): Promise<Option>
    updateExamById(id: string, payload: UpdateExamType): Promise<Test>
    findQuestionsByExamID(id: string): Promise<Question[]>
    findQuestionWithOptions(id: string): Promise<Test | null>
    findResults(): Promise<TestResult[]>
    createOption(payload: CreateOptionType): Promise<Option>
    createQuestion(payload: CreateQuestionType): Promise<Question>
    findUsersByIds(ids: string[]): Promise<User[]>
    findPositions(): Promise<Position[]>
    findPositionById(id: string): Promise<Position>
    createPosition(name: string): Promise<Position>
    deletePositionById(id: string): Promise<boolean>
    updatePositionById(id: string, name: string): Promise<Position>
}

export class AdminRepository implements IAdminRepository {
    constructor(private user: typeof User, private exam: typeof Test, private option: typeof Option, private question: typeof Question, private testResult: typeof TestResult, private position: typeof Position) { }
    async findUserAccountByID(id: string): Promise<User> {
        const userAccount = await this.user.findByPk(id)
        if (!userAccount) {
            throw new AppError('User account not found', 404)
        }
        return userAccount
    }
    async createUserAccount(payload: CreateAccountType): Promise<User> {
        return await this.user.create(payload)
    }
    async createExam(payload: CreateExamType): Promise<Test> {
        return await this.exam.create({
            title: payload.title,
            durationMinutes: payload.durationMinutes,
            startAt: payload.startAt,
            endAt: payload.endAt,
            category: payload.categoryId
        })
    }
    async createOption(payload: CreateOptionType): Promise<Option> {
        return await this.option.create(payload)
    }
    async createQuestion(payload: CreateQuestionType): Promise<Question> {
        return await this.question.create(payload)
    }

    async findExamByID(id: string): Promise<Test> {
        const exam = await this.exam.findByPk(id)
        if (!exam) {
            throw new AppError('Exam not found', 404)
        }
        return exam
    }
    async findQuestionByID(id: string): Promise<Question> {
        const question = await this.question.findByPk(id)
        if (!question) {
            throw new AppError('Question not found', 404)
        }
        return question
    }
    async findQuestionsByExamID(id: string): Promise<Question[]> {
        const questions = await this.question.findAll({ where: { testId: id } })
        if (!questions) {
            throw new AppError('Questions not found', 404)
        }
        return questions
    }

    async findAllUserAccount(): Promise<User[]> {
        return await this.user.findAll({
            attributes: ['id', 'username', 'password', 'name', 'email'],
            include: [
                {
                    model: this.position,
                    as: 'positions',
                    attributes: ['name']
                }
            ]
        })
    }

    async findAllExams(): Promise<Test[]> {
        return await this.exam.findAll({
            attributes: [
                'id',
                'title',
                'durationMinutes',
                'startAt',
                'endAt',
                [
                    Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Questions AS question
                    WHERE
                        question.testId = Test.id
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

    async findOptionByQuestionID(id: string): Promise<Option[]> {
        return await this.option.findAll({ where: { questionId: id } })
    }

    async findQuestionWithOptions(id: string): Promise<Test | null> {
        const exam = await this.exam.findByPk(id, {
            attributes: ['id', 'title', 'durationMinutes'],
            include: [
                {
                    separate: true,
                    model: this.question,
                    as: 'questions',
                    attributes: ['id', 'text'],
                    order: [['id', 'ASC']],
                    include: [
                        {
                            attributes: ['id', 'text', 'isCorrect'],
                            separate: true,
                            model: this.option,
                            as: 'options',
                            order: [['id', 'ASC']]
                        }
                    ]
                }
            ],
        });

        return exam;
    }

    async updateQuestionById(id: string, payload: UpdateQuestionType): Promise<Question> {
        const question = await this.question.findByPk(id)
        if (!question) {
            throw new AppError('Question not found', 404)
        }
        return await question.update(payload)
    }

    async deleteQuestionById(id: string): Promise<boolean> {
        const question = await this.question.findByPk(id)
        if (!question) {
            throw new AppError('Question not found', 404)
        }
        await question.destroy()
        return true
    }

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

    async updateOptionById(id: string, text: string, isCorrect: boolean): Promise<Option> {
        const option = await this.option.findByPk(id)
        if (!option) {
            throw new AppError('Option not found', 404)
        }
        return await option.update({ text, isCorrect })
    }

    async deleteOptionById(id: string): Promise<boolean> {
        const option = await this.option.findByPk(id)
        if (!option) {
            throw new AppError('Option not found', 404)
        }
        await option.destroy()
        return true
    }

    async findResults(): Promise<TestResult[]> {
        return await this.testResult.findAll()
    }

    async findUsersByIds(userIds: string[]): Promise<User[]> {
        return await this.user.findAll({
            where: {
                id: {
                    [Op.in]: userIds
                }
            },
            attributes: ['id', 'username', 'name', 'password', 'email']
        });
    }

    async findPositions(): Promise<Position[]> {
        return await this.position.findAll()
    }

    async findPositionById(id: string): Promise<Position> {
        const position = await this.position.findByPk(id)
        if (!position) {
            throw new AppError('Position not found', 404)
        }
        return position
    }

    async createPosition(name: string): Promise<Position> {
        return await this.position.create({ name })
    }

    async deletePositionById(id: string): Promise<boolean> {
        const position = await this.position.findByPk(id)
        if (!position) {
            throw new AppError('Position not found', 404)
        }
        await position.destroy()
        return true
    }

    async updatePositionById(id: string, name: string): Promise<Position> {
        const position = await this.position.findByPk(id)
        if (!position) {
            throw new AppError('Position not found', 404)
        }
        return await position.update({ name })
    }
}