import { Test } from "../../../config/database/models/Exam";
import { TestResult } from "../../../config/database/models/ExamResult";
import { User } from "../../../config/database/models/User";

export interface IResults {
    findResults(): Promise<TestResult[]>
}


export class AdminResultsRepository implements IResults {
    constructor(private user : typeof User, private exam : typeof Test, private testResult : typeof TestResult){}
    async findResults(): Promise<TestResult[]> {
        return await this.testResult.findAll({
            attributes: ['id', 'score', 'status', 'createdAt'],
            include: [
                {
                    model: this.user,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: this.exam,
                    attributes: ['id', 'title']
                }
            ]
        })
    }
}