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
    // createSchedule(payload: CreateScheduleType): Promise<CreateScheduleType>
    createExam(payload: CreateExamType): Promise<Test>
    createOption(payload: CreateOptionType): Promise<Option>
    createQuestion(payload: CreateQuestionType): Promise<Question>
}

export class AdminRepository implements IAdminRepository {
    constructor(private user: typeof User, private exam: typeof Test, private option: typeof Option, private question: typeof Question) { }
    async findUserAccountByID(id: string): Promise<User> {
        const userAccount = await this.user.findByPk(id)
        if (!userAccount) {
            throw new AppError('User account not found')
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

}