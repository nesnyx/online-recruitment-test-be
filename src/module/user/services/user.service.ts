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
        if (!questions) throw new AppError("Questions not found", 404)

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
        const questionAnswers = await this.userRepository.findQuestionAnswerByUserId(userId)
        return questionAnswers
    }


    async checkStatusExamHappening(userId: string, examId: string) {
        const [existingUser, existingExam] = await Promise.all([
            this.userRepository.findByUserId(userId),
            this.adminRepository.findExamByID(examId)
        ])
        if (!existingUser) throw new AppError("User not found", 404)
        if (!existingExam) throw new AppError("Exam not found", 404)

        const timeNow = new Date();
        const durationMilliSeconds = (existingExam.durationMinutes ?? 0) * 60 * 1000;
        const timeDiff = timeNow.getTime() - existingExam.startAt.getTime();

        return {
            "user_id": existingUser.id,
            "remaining_duration": durationMilliSeconds - timeDiff,
            "is_exam_ongoing": timeDiff < durationMilliSeconds
        }
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
        let existingExamResult = await this.userRepository.findExamResultsByUserId(userId);

        if (existingExamResult) {
            // OPTIMASI 2: Cek status dulu sebelum hitung matematika (lebih ringan)
            if (existingExamResult.status === TestResultStatus.SUBMITTED) {
                throw new AppError("Exam already submitted", 200);
            }

            // Hitung durasi
            const durationMilliSeconds = (existingExam.durationMinutes ?? 0) * 60 * 1000;
            const timeDiff = timeNow.getTime() - existingExamResult.startedAt.getTime();

            if (timeDiff > durationMilliSeconds) {
                throw new AppError("Exam time is over", 200);
            }
        } else {
            // OPTIMASI 3: Langsung kirim argumen tanpa membuat object Record tambahan
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


    // DEVELOPMENT STEP
    async submitExam(userId: string) {
        const user = await this.userRepository.findByUserId(userId)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        const examResult = await this.userRepository.findExamResultsByUserId(userId)
        if (!examResult) {
            throw new AppError("Exam result not found", 404)
        }
        return true
    }

}