import { IResults } from "../repository/admin.results.repository";


export class AdminResultService { 
    constructor(private readonly adminResultRepository : IResults){}

    async getResults() {
        const results = await this.adminResultRepository.findResults()
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

}