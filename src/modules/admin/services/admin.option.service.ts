import { CreateOptionType } from "../dto/create-option.dto";
import { IOptions } from "../repository/admin.option.repository";

export class AdminOptionService {
    constructor(private readonly adminOptionRepository: IOptions) { }


    async createOption(payload: CreateOptionType) {
        return await this.adminOptionRepository.createOption(payload)
    }
    async updateOption(optionId: string, text: string, isCorrect: boolean) {
        return await this.adminOptionRepository.updateOptionById(optionId, text, isCorrect)
    }

    async deleteOption(optionId: string) {
        return await this.adminOptionRepository.deleteOptionById(optionId)
    }

    async deleteOptionByQuestionId(questionId : string){
        return await this.adminOptionRepository.deleteOptionByQuestionId(questionId)
    }
    async getOptionsByQuestionID(id: string) {
        return await this.adminOptionRepository.findOptionByQuestionID(id)
    }
}