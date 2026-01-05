import { Transaction } from "sequelize";
import { TestResult, TestResultStatus } from "../../../config/database/models/ExamResult";
import { AppError } from "../../../utils/app-error";
import { IAdminRepository } from "../../admin/entity/admin.entity";
import { IUserRepository } from "../entity/user.entity";
import { Test } from "../../../config/database/models/Exam";


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

        return {
            user_id: userId,
            remaining_duration: Math.max(0, remaining), // Jangan sampai minus
            is_exam_ongoing: remaining > 0 && userResult.status === TestResultStatus.ONGOING
        };
    }



    async startExam(userId: string, examId: string) {
        const timeNow = new Date();

        // OPTIMASI 1: Jalankan pengecekan User dan Exam secara PARALEL
        // Ini mengurangi total waktu tunggu I/O database
        const [existingUser, existingExam] = await Promise.all([
            this.userRepository.findByUserId(userId),
            this.adminRepository.findExamByID(examId)
        ]);

        if (!existingUser) throw new AppError("User not found", 404);
        if (!existingExam) throw new AppError("Exam not found", 404);

        // Ambil hasil ujian
        let existingExamResult = await this.userRepository.findExamResultsByUserId(userId, examId);

        if (existingExamResult) {
            // OPTIMASI 2: Cek status dulu sebelum hitung matematika (lebih ringan)
            if (existingExamResult.status === TestResultStatus.SUBMITTED) {
                throw new AppError("Exam already submitted", 400);
            }

            // Hitung durasi
            const durationMilliSeconds = (existingExam.durationMinutes ?? 0) * 60 * 1000;
            const timeDiff = timeNow.getTime() - existingExamResult.startedAt.getTime();

            if (timeDiff > durationMilliSeconds) {
                throw new AppError("Exam time is over", 400);
            }
        } else {
            existingExamResult = await this.userRepository.createExamResult(
                userId,
                examId,
                timeNow,        // startedAt
                0,              // score
                0,              // correctCount
                0,              // totalQuestions
                TestResultStatus.ONGOING
            );
        }

        return existingExamResult;
    }



    async submitExam(userId: string, examId: string, transaction: Transaction) {
        const userResult = await this.userRepository.findUserResultWithExam(userId, examId, transaction);

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
            const toleranceMs = 30 * 1000; // Toleransi latency 30 detik

            if (now > (startTime + durationMs + toleranceMs)) {
                throw new Error("Waktu pengerjaan telah habis.");
            }
        }
        const [userAnswers, totalQuestionsCount] = await Promise.all([
            this.userRepository.findQuestionWithCorrectAnswerOptionsByUserId(userId, examId, transaction),
            this.userRepository.totalQuestionByExamId(examId, transaction)
        ])
        userAnswers.forEach((answer: any) => {
            const correctOptionId = answer.Question.options[0]?.id;
            if (answer.optionId === correctOptionId) {
                totalCorrect++;
            }
        });
        const finalScore = totalQuestionsCount > 0 ? (totalCorrect / totalQuestionsCount) * 100 : 0;
        await this.userRepository.updateExamResult(userId, TestResultStatus.SUBMITTED, finalScore, totalCorrect, totalQuestionsCount, new Date(), transaction)
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