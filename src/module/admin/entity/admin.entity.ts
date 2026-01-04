import { Test } from "../../../config/database/models/Exam"
import { Option } from "../../../config/database/models/Option"
import { Question } from "../../../config/database/models/Question"
import { User } from "../../../config/database/models/User"
import { AppError } from "../../../utils/app-error"
import { CreateAccountType } from "../dto/create-account.dto"
import { CreateExamType } from "../dto/create-exam.dto"
import { CreateOptionType } from "../dto/create-option.dto"
import { CreateQuestionType } from "../dto/create-question.dto"




export interface IAdminRepository {
    findUserAccountByID(id: string): Promise<User>
    createUserAccount(payload: CreateAccountType): Promise<User>
    findAllUserAccount(): Promise<User[]>
    createExam(payload: CreateExamType): Promise<Test>
    findAllExams(): Promise<Test[]>
    findQuestionByID(id: string): Promise<Question>
    findExamByID(id: string): Promise<Test>
    findQuestionsByExamID(id: string): Promise<Question[]>
    createOption(payload: CreateOptionType): Promise<Option>
    createQuestion(payload: CreateQuestionType): Promise<Question>
}

export class AdminRepository implements IAdminRepository {
    constructor(private user: typeof User, private exam: typeof Test, private option: typeof Option, private question: typeof Question) { }
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
        return await this.exam.create(payload)
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
        return await this.user.findAll()
    }

    async findAllExams(): Promise<Test[]> {
        return await this.exam.findAll()
    }
}