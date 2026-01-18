import { Test } from "../../../config/database/models/Exam"
import { Option } from "../../../config/database/models/Option"
import { Question } from "../../../config/database/models/Question"
import { AppError } from "../../../utils/app-error"
import { CreateQuestionType } from "../dto/create-question.dto"
import { UpdateQuestionType } from "../dto/update-question.dto"

export interface IQuestion {
    findQuestionByID(id: string): Promise<Question>
    updateQuestionById(id: string, payload: UpdateQuestionType): Promise<Question>
    findQuestionWithOptions(id: string): Promise<Test | null>
    deleteQuestionById(id: string): Promise<boolean>
    createQuestion(payload: CreateQuestionType): Promise<Question>
    findQuestionsByExamID(id: string): Promise<Question[]>
}

export class AdminQuestionRepository implements IQuestion {
    constructor(private readonly question: typeof Question, private readonly option: typeof Option, private readonly exam: typeof Test) { }
    async createQuestion(payload: CreateQuestionType): Promise<Question> {
        return await this.question.create(payload)
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
}