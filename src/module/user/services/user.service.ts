
import { TestResultStatus } from "../../../config/database/models/ExamResult";
import { AppError } from "../../../utils/app-error";
import { IAdminRepository } from "../../admin/entity/admin.entity";
import { IUserRepository } from "../entity/user.entity";



export class UserService {
    constructor(private readonly userRepository: IUserRepository, private readonly adminRepository: IAdminRepository) { }

    async findByUserId(userId: string) {
        const user = await this.userRepository.findByUserId(userId)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        return user
    }

    async createOrUpdateQuestionAnswer(userId: string, optionId: string, questionId: string) {
        const [existingUser, existingQuestion] = await Promise.all([
            this.userRepository.findByUserId(userId),
            this.adminRepository.findQuestionByID(questionId)
        ])
        if (!existingUser) throw new AppError("User not found", 404)
        if (!existingQuestion) throw new AppError("Question not found", 404)
        const user = await this.userRepository.createOrUpdateQuestionAnswer(userId, optionId, questionId)
        return user
    }

    async findQuestionExam(examId: string) {
        const [existingExam, questions] = await Promise.all([
            this.adminRepository.findExamByID(examId),
            this.userRepository.findQuestionExam(examId)
        ])
        if (!existingExam) throw new AppError("Exam not found", 404)
        return {
            exam: {
                id: existingExam.id,
                title: existingExam.title,
                durationMinutes: existingExam.durationMinutes,
            },
            questions: questions
        }
    }

    // Untuk Get Jawaban yang sudah terjawab secara stateful
    async findQuestionAnswerByUserId(userId: string) {
        return await this.userRepository.findQuestionAnswerByUserId(userId)
    }


    async checkStatusExamHappening(userId: string, examId: string) {
        const [exam, userResult] = await Promise.all([
            this.adminRepository.findExamByID(examId),
            this.userRepository.findExamResultsByUserId(userId, examId) // Pastikan filter userId & examId
        ]);

        if (!exam) throw new AppError("Exam not found", 404);
        if (!userResult) return { is_exam_ongoing: false, message: "Belum memulai ujian" };

        const startTime = userResult.startedAt.getTime();
        const durationMs = (exam.durationMinutes ?? 0) * 60 * 1000;
        const timeNow = Date.now();
        const timeElapsed = timeNow - startTime;
        const remaining = durationMs - timeElapsed;
        const remainingMs = Math.max(0, durationMs - timeElapsed);
        return {
            user_id: userId,
            remaining_duration: Math.max(0, remaining),
            remaining_duration_minutes: Math.floor(remainingMs / (60 * 1000)),
            is_exam_ongoing: remaining > 0 && userResult.status === TestResultStatus.ONGOING
        };
    }



    async startExam(userId: string, examId: string) {
        const timeNow = new Date();
        const [existingUser, existingExam] = await Promise.all([
            this.userRepository.findByUserId(userId),
            this.adminRepository.findExamByID(examId)
        ]);
        if (!existingUser) throw new AppError("User not found", 404);
        if (!existingExam) throw new AppError("Exam not found", 404);
        const startAt = new Date(existingExam.startAt);
        const endAt = new Date(existingExam.endAt);
        if (timeNow.getTime() < startAt.getTime()) throw new AppError("Ujian belum dimulai.", 400);
        if (timeNow.getTime() > endAt.getTime()) throw new AppError("Masa berlaku ujian telah berakhir.", 400);
        let existingExamResult = await this.userRepository.findExamResultsByUserId(userId, examId);
        if (existingExamResult) {
            if (existingExamResult.status === TestResultStatus.SUBMITTED) {
                throw new AppError("Ujian sudah selesai dikerjakan.", 400);
            }
            const durationMilliSeconds = (existingExam.durationMinutes ?? 0) * 60 * 1000;
            const timeDiff = timeNow.getTime() - existingExamResult.startedAt.getTime();
            if (timeDiff > durationMilliSeconds) {
                await this.userRepository.updateExamResult(
                    userId,
                    TestResultStatus.SUBMITTED,
                    existingExamResult.score || 0,
                    existingExamResult.correctCount || 0,
                    existingExamResult.totalQuestions || 0,
                    timeNow,
                );
                throw new AppError("Waktu pengerjaan Anda telah habis.", 400);
            }
            return existingExamResult;
        } else {
            existingExamResult = await this.userRepository.createExamResult(
                userId,
                examId,
                timeNow,
                0,
                0,
                0,
                TestResultStatus.ONGOING,
            );
        }

        return existingExamResult;
    }



    async submitExam(userId: string, examId: string) {
        const userResult = await this.userRepository.findUserResultWithExam(userId, examId);
        if (!userResult) {
            throw new AppError("Sesi pengerjaan tidak ditemukan.", 404);
        }

        if (userResult.status === TestResultStatus.SUBMITTED) {
            throw new AppError("Ujian sudah disubmit sebelumnya.", 400);
        }
        const exam = (userResult as any).Test;
        const startTime = userResult.startedAt.getTime();
        const now = new Date().getTime();
        let totalCorrect = 0;

        if (exam && exam.durationMinutes) {
            const durationMs = exam.durationMinutes * 60 * 1000;
            const toleranceMs = 30 * 1000;

            if (now > (startTime + durationMs + toleranceMs)) {
                throw new Error("Waktu pengerjaan telah habis.");
            }
        }
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
        await this.userRepository.updateExamResult(userId, TestResultStatus.SUBMITTED, finalScore, totalCorrect, totalQuestionsCount, new Date())
        return {
            score: finalScore,
            summary: {
                totalQuestions: totalQuestionsCount,
                answered: userAnswers.length,
                correct: totalCorrect,
                incorrect: totalQuestionsCount - totalCorrect
            }
        };
    }

}