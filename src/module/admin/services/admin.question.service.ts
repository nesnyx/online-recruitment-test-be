import { CreateQuestionType } from "../dto/create-question.dto";
import { UpdateQuestionType } from "../dto/update-question.dto";
import { IQuestion } from "../repository/admin.question.repository";
import { AdminOptionService } from "./admin.option.service";


export class AdminQuestionService {
    constructor(private readonly adminQuestionRepository: IQuestion, private readonly adminOptionService: AdminOptionService) { }
    async getQuestionWithOptions(examId: string) {
        return await this.adminQuestionRepository.findQuestionWithOptions(examId)
    }

    async updateQuestion(questionId: string, payload: UpdateQuestionType) {
        return await this.adminQuestionRepository.updateQuestionById(questionId, payload)
    }

    async deleteQuestion(questionId: string) {
        return await Promise.all([
            this.adminOptionService.deleteOptionByQuestionId(questionId),
            this.adminQuestionRepository.deleteQuestionById(questionId)
        ])
    }

    async createQuestion(payload: CreateQuestionType) {
        return await this.adminQuestionRepository.createQuestion(payload)
    }


    async findQuestionByID(id: string) {
        return await this.adminQuestionRepository.findQuestionByID(id)
    }
}