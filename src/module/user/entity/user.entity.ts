import { TestResult, TestResultStatus } from "../../../config/database/models/ExamResult";
import { Question } from "../../../config/database/models/Question";
import { QuestionAnswer } from "../../../config/database/models/QuestionAnswer";
import { User } from "../../../config/database/models/User";
import { Option } from "../../../config/database/models/Option";
import { Sequelize, Transaction } from "sequelize";
import { Test } from "../../../config/database/models/Exam";
export interface IUserRepository {
    findByUserId(userId: string): Promise<User | null>
    createOrUpdateQuestionAnswer(userId: string, optionId: string, questionId: string): Promise<QuestionAnswer>
    findQuestionAnswerByUserId(userId: string): Promise<QuestionAnswer[]>
    findExamResultsByUserId(userId: string): Promise<TestResult | null>
    createExamResult(userId: string, examId: string, startedAt: Date, score: number, correctCount: number, totalQuestions: number, status: TestResultStatus): Promise<TestResult>
    findQuestionExam(examId: string): Promise<Question[]>
    updateExamResult(userId: string, status: TestResultStatus, score: number, correctCount: number, totalQuestions: number, submittedAt: Date, transaction: Transaction): Promise<TestResult | any>
    findQuestionWithCorrectAnswerOptionsByUserId(userId: string, examId: string, transaction: Transaction): Promise<QuestionAnswer[]>
    totalQuestionByExamId(examId: string, transaction: Transaction): Promise<number>
    findUserResultWithExam(userId: string, examId: string, transaction: Transaction): Promise<TestResult | null>
}

export class UserRepository implements IUserRepository {
    constructor(private readonly user: typeof User, private readonly questionAnswer: typeof QuestionAnswer, private readonly testResult: typeof TestResult, private readonly question: typeof Question, private readonly test: typeof Test, private readonly option: typeof Option) { }
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
    async findQuestionAnswerByUserId(userId: string): Promise<QuestionAnswer[]> {
        return await this.questionAnswer.findAll({
            attributes: ['id', 'userId', 'questionId', 'optionId'],
            where: { userId }
        })
    }
    async findExamResultsByUserId(userId: string): Promise<TestResult | null> {
        return await this.testResult.findOne({ where: { userId } })
    }
    async createExamResult(userId: string, examId: string, startedAt: Date, score: number, correctCount: number, totalQuestions: number, status: TestResultStatus): Promise<TestResult> {
        return await this.testResult.create({ userId, testId: examId, startedAt, score, correctCount, totalQuestions, status })
    }
    async findQuestionExam(examId: string): Promise<Question[]> {
        return await this.question.findAll({ where: { testId: examId } })
    }
    async updateExamResult(userId: string, status: TestResultStatus, score: number, correctCount: number, totalQuestions: number, submittedAt: Date, transaction: Transaction): Promise<TestResult | any> {
        return await this.testResult.update({ status: status, score, correctCount, totalQuestions, submittedAt }, { where: { userId }, transaction: transaction })
    }
    async findQuestionWithCorrectAnswerOptionsByUserId(userId: string, examId: string, transaction: Transaction): Promise<QuestionAnswer[]> {
        return await this.questionAnswer.findAll({
            where: { userId },
            include: [{
                model: this.question,
                as: 'questions',
                where: { testId: examId }, // Filter supaya hanya soal dari exam ini
                attributes: ['id'],
                include: [{
                    model: this.option,
                    as: 'options',
                    where: { isCorrect: true }, // Ambil kunci jawabannya
                    attributes: ['id']
                }]
            }],
            transaction: transaction
        });
    }

    async totalQuestionByExamId(examId: string, transaction: Transaction): Promise<number> {
        return await this.question.count({ where: { testId: examId }, transaction: transaction })
    }

    async findUserResultWithExam(userId: string, examId: string, transaction: Transaction): Promise<TestResult | null> {
        return await this.testResult.findOne({
            where: { userId, testId: examId },
            attributes: ['id', 'status', 'createdAt', 'startedAt'],
            include: [{
                model: this.test,
                as: 'Test', // pastikan aliasnya sesuai relasi TestResult.belongsTo(Test)
                attributes: ['id', 'durationMinutes'],
            }],
            lock: transaction.LOCK.UPDATE,
            transaction
        });
    }

}