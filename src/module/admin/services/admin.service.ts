import { AppError } from "../../../utils/app-error";
import { sendExamInvitation } from "../../../utils/email-gateway";
import { generateSecurePassword, generateRandomUsername } from "../../../utils/generate-password";
import { CreateAccountType } from "../dto/create-account.dto";
import { CreateExamType } from "../dto/create-exam.dto";
import { CreateOptionType } from "../dto/create-option.dto";
import { CreateQuestionType } from "../dto/create-question.dto";
import { UpdateAccountType } from "../dto/update-account.dto";
import { UpdateExamType } from "../dto/update-exam.dto";
import { UpdateQuestionType } from "../dto/update-question.dto";
import { IAdminRepository } from "../entity/admin.entity";
import pLimit from 'p-limit';


export class AdminService {
    constructor(private adminRepository: IAdminRepository) { }

    async findUserAccountByID(id: string) {
        return await this.adminRepository.findUserAccountByID(id)
    }

    async findExamByID(id: string) {
        return await this.adminRepository.findExamByID(id)
    }

    async findQuestionByID(id: string) {
        return await this.adminRepository.findQuestionByID(id)
    }

    async createUserAccount(name: string, email: string, positionId?: string) {
        const password = generateSecurePassword()
        const username = generateRandomUsername()
        const payload: CreateAccountType = {
            name,
            email,
            positionId,
            username,
            password
        }
        return await this.adminRepository.createUserAccount(payload)
    }

    async createExam(payload: CreateExamType) {
        await this.adminRepository.findPositionById(payload.categoryId)
        return await this.adminRepository.createExam(payload)
    }

    async createOption(payload: CreateOptionType) {
        return await this.adminRepository.createOption(payload)
    }

    async createQuestion(payload: CreateQuestionType) {
        return await this.adminRepository.createQuestion(payload)
    }

    async getAllUserAccount() {
        const accounts = await this.adminRepository.findAllUserAccount()
        return accounts.map((account: any) => ({
            id: account.id,
            username: account.username,
            password: account.password,
            name: account.name,
            email: account.email,
            position: account.positions?.name || 'No Position'
        }))
    }




    async getAllExams() {
        const exams = await this.adminRepository.findAllExams()
        return exams.map((exam: any) => ({
            id: exam.id,
            title: exam.title,
            description: exam.description,
            durationMinutes: exam.durationMinutes,
            positionId: exam.positionId,
            category: exam.Position?.name ?? null,
            startAt: exam.startAt,
            endAt: exam.endAt,
            totalQuestions: exam.totalQuestions || exam.getDataValue('totalQuestions') || 0,
        }))
    }

    async getOptionsByQuestionID(id: string) {
        return await this.adminRepository.findOptionByQuestionID(id)
    }

    async getQuestionWithOptions(examId: string) {
        return await this.adminRepository.findQuestionWithOptions(examId)
    }

    async updateExam(examId: string, payload: UpdateExamType) {
        return await this.adminRepository.updateExamById(examId, payload)
    }

    async updateQuestion(questionId: string, payload: UpdateQuestionType) {
        return await this.adminRepository.updateQuestionById(questionId, payload)
    }

    async updateAccount(accountId: string, payload: UpdateAccountType) {
        return await this.adminRepository.updateAccounts(accountId, payload)
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

    async getResults() {
        const results = await this.adminRepository.findResults()
        return results.map((result: any) => ({
            id: result.id,
            score: result.score,
            status: result.status,
            name: result.User.name,
            email: result.User.email,
            exam: result.Test.title,
            date: result.createdAt,
        }))
    }
    private retry = async (fn: () => Promise<any>, retries = 3, delay = 2000): Promise<any> => {
        try {
            return await fn();
        } catch (error) {
            if (retries <= 0) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.retry(fn, retries - 1, delay * 2);
        }
    };
    async sendInvitation(examId: string, userIds: string[]) {
        const [exam, users] = await Promise.all([
            this.adminRepository.findExamByID(examId),
            this.adminRepository.findUsersByIds(userIds)
        ]);
        if (!exam) throw new AppError("Ujian tidak ditemukan", 404);
        if (users.length === 0) throw new AppError("Daftar user kosong", 400);
        const missingCount = userIds.length - users.length;
        const limit = pLimit(5);
        const emailPromises = users.map(user => {
            return limit(async () => {
                await this.adminRepository.createExamAccounts(user.id, examId)
                return sendExamInvitation(
                    user.email,
                    user.name,
                    exam.title,
                    user.username,
                    user.password,
                    exam.startAt,
                    exam.endAt,
                    Number(exam.durationMinutes)
                );
            });
        });
        const results = await Promise.allSettled(emailPromises);
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const failedCount = results.length - successCount;
        return {
            totalRequested: userIds.length,
            totalFound: users.length,
            successCount,
            failedCount,
            missingInDb: missingCount,
            results: results.map(r => r.status)
        };
    }
    async createPosition(name: string) {
        return await this.adminRepository.createPosition(name)
    }
    async getAllPositions() {
        return await this.adminRepository.findPositions()
    }
    async getPositionById(id: string) {
        return await this.adminRepository.findPositionById(id)
    }

    async deletePositionById(id: string) {
        return await this.adminRepository.deletePositionById(id)
    }

    async updatePositionById(id: string, name: string) {
        return await this.adminRepository.updatePositionById(id, name)
    }

    async findExamAccountByUserId(id: string) {
        return await this.adminRepository.findExamAccountByUserId(id)
    }

}