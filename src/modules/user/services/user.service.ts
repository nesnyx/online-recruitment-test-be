
import { TestResultStatus } from "../../../config/database/models/ExamResult";
import { scheduleAutoSubmit } from "../../../queues/exam.queue";
import { AppError } from "../../../utils/app-error";
import { eventBus } from "../../../utils/event-bus";
import { AdminExamService } from "../../admin/services/admin.exam.service";
import { AdminQuestionService } from "../../admin/services/admin.question.service";
import { IUserRepository } from "../repository/user.repository";



export class UserService {
    constructor(private readonly userRepository: IUserRepository, private readonly questionService: AdminQuestionService, private readonly examService: AdminExamService) { }

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
            this.questionService.findQuestionByID(questionId)
        ])
        if (!existingUser) throw new AppError("User not found", 404)
        if (!existingQuestion) throw new AppError("Question not found", 404)
        const user = await this.userRepository.createOrUpdateQuestionAnswer(userId, optionId, questionId)
        return user
    }

    async findQuestionExam(examId: string) {
        const [existingExam, questions] = await Promise.all([
            this.examService.findExamByID(examId),
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

    async findQuestionAnswerByUserId(userId: string) {
        return await this.userRepository.findQuestionAnswerByUserId(userId)
    }


    async checkStatusExamHappening(userId: string, examId: string) {
        const [exam, userResult] = await Promise.all([
            this.examService.findExamByID(examId),
            this.userRepository.findExamResultsByUserId(userId, examId)
        ]);

        if (!exam) throw new AppError("Exam not found", 404);
        if (!userResult) {
            return {
                is_allowed_to_start: true,
                is_exam_ongoing: false,
                message: "Siap dimulai"
            };
        }

        if (userResult.status === TestResultStatus.SUBMITTED) {
            return {
                is_allowed_to_start: false,
                is_exam_ongoing: false,
                is_exam_completed: true,
                message: "Ujian sudah selesai dikerjakan dan dikirim."
            };
        }
        const startTime = userResult.startedAt.getTime();
        const durationMs = (exam.durationMinutes ?? 0) * 60 * 1000;
        const timeNow = Date.now();
        const timeElapsed = timeNow - startTime;
        const remainingMs = Math.max(0, durationMs - timeElapsed);

        if (remainingMs <= 0) {
            return {
                is_allowed_to_start: false,
                is_exam_ongoing: false,
                message: "Waktu ujian telah habis."
            };
        }
        return {
            user_id: userId,
            remaining_duration_ms: remainingMs,
            server_time_iso: new Date().toISOString(),
            remaining_duration_minutes: Math.floor(remainingMs / (60 * 1000)),
            is_allowed_to_start: false,
            is_exam_ongoing: true
        };
    }


    async startExam(userId: string, examId: string) {
        const timeNow = new Date();
        const [existingUser, existingExam] = await Promise.all([
            this.userRepository.findByUserId(userId),
            this.examService.findExamByID(examId)
        ]);
        if (!existingUser) throw new AppError("User not found", 404);
        if (!existingExam) throw new AppError("Exam not found", 404);
        const startAt = new Date(existingExam.startAt);
        const endAt = new Date(existingExam.endAt);
        console.log("Exam StartAt:", startAt, "EndAt:", endAt, "Now:", timeNow);
        if (timeNow.getTime() < startAt.getTime()) throw new AppError("Ujian belum dimulai.", 400);
        if (timeNow.getTime() > endAt.getTime()) throw new AppError("Masa berlaku ujian telah berakhir.", 400);
        let existingExamResult = await this.userRepository.findExamResultsByUserId(userId, examId);
        const durationMilliSeconds = (existingExam.durationMinutes ?? 0) * 60 * 1000;
        if (existingExamResult) {
            if (existingExamResult.status === TestResultStatus.SUBMITTED) {
                throw new AppError("Ujian sudah selesai dikerjakan.", 400);
            }
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
            await scheduleAutoSubmit(userId, examId, durationMilliSeconds);
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

        if (exam && exam.durationMinutes) {
            const durationMs = exam.durationMinutes * 60 * 1000;
            const toleranceMs = 30 * 1000;

            if (now > (startTime + durationMs + toleranceMs)) {
                throw new Error("Waktu pengerjaan telah habis.");
            }
        }

        await this.userRepository.updateStatus(userId, examId, TestResultStatus.SUBMITTED);
        eventBus.emit("user.exam.submitted", { userId, examId, submittedAt: new Date() });
        return {
            message: "Ujian berhasil dikumpulkan. Hasil sedang diproses.",
            status: TestResultStatus.SUBMITTED
        };
    }


    async getExamResultsByUserId(userId: string,examId : string) {
        const existingUser = await this.userRepository.findByUserId(userId);
        if (!existingUser) throw new AppError("User not found", 404);
        const results = await this.userRepository.findExamResultsByUserId(userId,examId);
        return results;
    }

}