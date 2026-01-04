import { AppError } from "../../../utils/app-error";
import { CreateAccountType } from "../dto/create-account.dto";
import { CreateExamType } from "../dto/create-exam.dto";
import { CreateOptionType } from "../dto/create-option.dto";
import { CreateQuestionType } from "../dto/create-question.dto";
import { IAdminRepository } from "../entity/admin.entity";



export class AdminService {
    constructor(private adminRepository: IAdminRepository) { }

    async findUserAccountByID(id: string) {
        const user = await this.adminRepository.findUserAccountByID(id)
        if (!user) {
            throw new AppError('User not found', 404)
        }
        return user
    }

    async findExamByID(id: string) {
        const exam = await this.adminRepository.findExamByID(id)
        if (!exam) {
            throw new AppError('Exam not found', 404)
        }
        return exam
    }

    async findQuestionByID(id: string) {
        const question = await this.adminRepository.findQuestionByID(id)
        if (!question) {
            throw new AppError('Question not found', 404)
        }
        return question
    }

    async createUserAccount(payload: CreateAccountType) {
        return await this.adminRepository.createUserAccount(payload)
    }

    async createExam(payload: CreateExamType) {
        return await this.adminRepository.createExam(payload)
    }

    async createOption(payload: CreateOptionType) {
        return await this.adminRepository.createOption(payload)
    }

    async createQuestion(payload: CreateQuestionType) {
        return await this.adminRepository.createQuestion(payload)
    }


    async getAllUserAccount() {
        return await this.adminRepository.findAllUserAccount()
    }

    async getAllExams() {
        return await this.adminRepository.findAllExams()
    }

    async getOptionsByQuestionID(id: string) {
        return await this.adminRepository.findOptionByQuestionID(id)
    }

    async getQuestionWithOptions(examId: string) {
        return await this.adminRepository.findQuestionWithOptions(examId)
    }

    async updateExam(examId: string, payload: CreateExamType) {
        return await this.adminRepository.updateExamById(examId, payload)
    }

    async updateQuestion(questionId: string, payload: CreateQuestionType) {
        return await this.adminRepository.updateQuestionById(questionId, payload)
    }

    async updateOption(optionId: string, text: string, isCorrect: boolean) {
        return await this.adminRepository.updateOptionById(optionId, text, isCorrect)
    }

    async deleteOption(optionId: string) {
        return await this.adminRepository.deleteOptionById(optionId)
    }

    async deleteQuestion(questionId: string) {
        return await this.adminRepository.deleteQuestionById(questionId)
    }


}