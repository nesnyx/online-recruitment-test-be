import { IExamAccounts } from "../repository/admin.exam-account.repository";


export class AdminExamAccountService {
    constructor(private readonly adminExamAccountRepository : IExamAccounts){}
    async findExamAccountByUserId(id: string) {
        return await this.adminExamAccountRepository.findExamAccountByUserId(id)
    }

    async createExamAccounts(userId : string , examId : string){
        return await this.adminExamAccountRepository.createExamAccounts(userId, examId)
    }
}