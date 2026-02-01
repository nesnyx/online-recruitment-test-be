import { TestResultStatus } from "../../../config/database/models/ExamResult";
import { AppError } from "../../../utils/app-error";
import { eventBus } from "../../../utils/event-bus";
import { logger } from "../../../utils/logger";
import { IUserRepository } from "../repository/user.repository";

export class UserEventListener {
    constructor(private readonly userRepository: IUserRepository) {
    }
    async handleExamSubmittedEvent() {
        eventBus.on("user.exam.submitted", async (payload: { userId: string, examId: string, submittedAt: Date }) => {
            const { userId, examId } = payload;
            let totalCorrect = 0;
            try {
                const [userAnswers, totalQuestionsCount] = await Promise.all([
                    this.userRepository.findQuestionWithCorrectAnswerOptionsByUserId(userId, examId),
                    this.userRepository.totalQuestionByExamId(examId)
                ])
                if (!Array.isArray(userAnswers)) {
                    throw new AppError("Expected userAnswers to be an array",400);
                }

                userAnswers.forEach((answer:any) => {
                    const correctOptionId = answer.Question.options[0]?.id;
                    if (answer.optionId === correctOptionId) {
                        totalCorrect++;
                    }
                });
                const finalScore = totalQuestionsCount > 0 ? (totalCorrect / totalQuestionsCount) * 100 : 0;
                await this.userRepository.updateExamResult(userId, TestResultStatus.SUBMITTED, finalScore, totalCorrect, totalQuestionsCount, new Date())
                logger.info(`[AutoGrade] Success: User ${userId} scored ${finalScore}`);
            } catch (error) {
                logger.error(`[AutoGrade] Error calculating score for User ${userId}:`, error);
            }
        })
    }
}