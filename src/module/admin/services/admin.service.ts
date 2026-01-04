
import { Test } from "../../../config/database/models/Exam";
import { Option } from "../../../config/database/models/Option";
import { Question } from "../../../config/database/models/Question";
import { User } from "../../../config/database/models/User";
import { AppError } from "../../../utils/app-error";
import { CreateAccountType } from "../dto/create-account.dto";
import { CreateExamType } from "../dto/create-exam.dto";
import { CreateOptionType } from "../dto/create-option.dto";
import { CreateQuestionType } from "../dto/create-question.dto";
import { IAdminRepository } from "../entity/admin.entity";



export class AdminService {
    constructor(private adminRepository: IAdminRepository) { }

    async findUserAccountByID(id: string): Promise<User> {
        const user = await this.adminRepository.findUserAccountByID(id)
        if (!user) {
            throw new AppError('User not found', 404)
        }
        return user
    }

    async findExamByID(id: string): Promise<Test> {
        const exam = await this.adminRepository.findExamByID(id)
        if (!exam) {
            throw new AppError('Exam not found', 404)
        }
        return exam
    }

    async findQuestionByID(id: string): Promise<Question> {
        const question = await this.adminRepository.findQuestionByID(id)
        if (!question) {
            throw new AppError('Question not found', 404)
        }
        return question
    }

    async createUserAccount(payload: CreateAccountType): Promise<User> {
        return await this.adminRepository.createUserAccount(payload)
    }

    async createExam(payload: CreateExamType): Promise<Test> {
        return await this.adminRepository.createExam(payload)
    }

    async createOption(payload: CreateOptionType): Promise<Option> {
        return await this.adminRepository.createOption(payload)
    }

    async createQuestion(payload: CreateQuestionType): Promise<Question> {
        return await this.adminRepository.createQuestion(payload)
    }

    async findQuestionsByExamID(id: string): Promise<Question[]> {
        return await this.adminRepository.findQuestionsByExamID(id)
    }

    async getAllUserAccount(): Promise<User[]> {
        return await this.adminRepository.findAllUserAccount()
    }

    async getAllExams(): Promise<Test[]> {
        return await this.adminRepository.findAllExams()
    }
}