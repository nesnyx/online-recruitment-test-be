import { ExamAccounts } from "../../../config/database/models/ExamAccounts"

export interface IExamAccounts {
    
    createExamAccounts(userId: string, testId: string): Promise<ExamAccounts>
    findExamAccountByUserId(id: string): Promise<ExamAccounts | null>
}


export class AdminExamAccountRepository implements IExamAccounts {
    constructor(private readonly examAccounts : typeof ExamAccounts) {

    }
    
    async createExamAccounts(userId: string, testId: string): Promise<ExamAccounts> {
        return await this.examAccounts.create({
            examId: testId,
            accountId: userId
        })
    }

    async findExamAccountByUserId(id: string): Promise<ExamAccounts | null> {
        return await this.examAccounts.findOne({ where: { accountId: id } })
    }
}