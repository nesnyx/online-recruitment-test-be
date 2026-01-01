
import { TestResult, TestResultStatus } from "../../../config/database/models/ExamResult";
import { Question } from "../../../config/database/models/Question";
import { QuestionAnswer } from "../../../config/database/models/QuestionAnswer";
import { User } from "../../../config/database/models/User";

export interface IUserRepository {
    findByUserId(userId: string): Promise<User | null>
    createOrUpdateQuestionAnswer(userId: string, optionId: string, questionId: string): Promise<QuestionAnswer>
    findExamResultsByUserId(userId: string): Promise<TestResult | null>
    createExamResult(userId: string, examId: string, startedAt: Date, submittedAt: Date, score: number, correctCount: number, totalQuestions: number, status: TestResultStatus): Promise<TestResult>
    findQuestionExam(examId: string): Promise<Question[]>
    updateExamResult(userId: string, status: TestResultStatus): Promise<TestResult | any>
}

export class UserRepository implements IUserRepository {
    constructor(private readonly user: typeof User, private readonly questionAnswer: typeof QuestionAnswer, private readonly testResult: typeof TestResult, private readonly question: typeof Question) { }
    async findByUserId(userId: string): Promise<User | null> {
        return await this.user.findByPk(userId)
    }
    async createOrUpdateQuestionAnswer(userId: string, optionId: string, questionId: string): Promise<QuestionAnswer> {
        const [result] = await this.questionAnswer.upsert({
            userId,
            optionId,
            questionId
        });
        return result;
    }
    async findExamResultsByUserId(userId: string): Promise<TestResult | null> {
        return await this.testResult.findOne({ where: { userId } })
    }
    async createExamResult(userId: string, examId: string, startedAt: Date, submittedAt: Date, score: number, correctCount: number, totalQuestions: number, status: TestResultStatus): Promise<TestResult> {
        return await this.testResult.create({ userId, testId: examId, startedAt, submittedAt, score, correctCount, totalQuestions, status })
    }
    async findQuestionExam(examId: string): Promise<Question[]> {
        return await this.question.findAll({ where: { testId: examId } })
    }
    async updateExamResult(userId: string, status: TestResultStatus): Promise<TestResult | any> {
        return await this.testResult.update({ status: status }, { where: { userId } })
    }
}