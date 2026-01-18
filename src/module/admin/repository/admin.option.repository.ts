import { Option } from "../../../config/database/models/Option"
import { AppError } from "../../../utils/app-error"
import { CreateOptionType } from "../dto/create-option.dto"

export interface IOptions {
    deleteOptionById(id: string): Promise<boolean>
    deleteOptionByQuestionId(questionId: string): Promise<boolean>
    updateOptionById(id: string, text: string, isCorrect: boolean): Promise<Option>
    createOption(payload: CreateOptionType): Promise<Option>
    findOptionByQuestionID(id: string): Promise<Option[]>
}

export class AdminOptionRepostory implements IOptions {
    constructor(private readonly option: typeof Option) { }
    async createOption(payload: CreateOptionType): Promise<Option> {
        return await this.option.create(payload)
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

    async deleteOptionByQuestionId(questionId: string): Promise<boolean> {
        const deletedCount = await this.option.destroy({
            where: { questionId }
        })

        if (deletedCount === 0) {
            throw new AppError('Option not found', 404)
        }

        return true
    }


    async findOptionByQuestionID(id: string): Promise < Option[] > {
    return await this.option.findAll({ where: { questionId: id } })
}
}