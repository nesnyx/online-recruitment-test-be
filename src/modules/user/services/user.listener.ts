import { TestResultStatus } from "../../../config/database/models/ExamResult";
import { eventBus } from "../../../utils/event-bus";
import { IUserRepository } from "../repository/user.repository";

export class UserEventListener {
    constructor(private readonly userRepository: IUserRepository) {
    }
    async handleExamSubmittedEvent() {
        eventBus.on("user.exam.submitted", async (payload: { userId: string, examId: string, submittedAt: Date }) => {
            const { userId, examId, submittedAt } = payload;
            let totalCorrect = 0;
            try {
                const [userAnswers, totalQuestionsCount] = await Promise.all([
                    this.userRepository.findQuestionWithCorrectAnswerOptionsByUserId(userId, examId),
                    this.userRepository.totalQuestionByExamId(examId)
                ])
                userAnswers.forEach((answer: any) => {
                    const correctOptionId = answer.Question.options[0]?.id;
                    if (answer.optionId === correctOptionId) {
                        totalCorrect++;
                    }
                });
                const finalScore = totalQuestionsCount > 0 ? (totalCorrect / totalQuestionsCount) * 100 : 0;
                await this.userRepository.updateExamResult(userId, TestResultStatus.SUBMITTED, finalScore, totalCorrect, totalQuestionsCount, submittedAt)
                console.log(`[AutoGrade] Success: User ${userId} scored ${finalScore}`);
            } catch (error) {
                console.error(`[AutoGrade] Error calculating score for User ${userId}:`, error);
            }
        })
    }
}