import { Request, Response, NextFunction } from 'express';
import { TestResultStatus } from '../../config/database/models/ExamResult';
import { AppError } from '../../utils/app-error';
import { UserRepository } from '../user/entity/user.entity';
import { AdminRepository } from '../admin/entity/admin.entity';

export const isExamActive = (userRepository: UserRepository, adminRepository: AdminRepository) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const { examId } = req.params;
            if (!userId) throw new AppError("Unauthorized", 401);
            const [exam, userResult] = await Promise.all([
                adminRepository.findExamByID(examId),
                userRepository.findExamResultsByUserId(userId, examId)
            ]);

            // 1. Validasi Dasar
            if (!exam) throw new AppError("Ujian tidak ditemukan", 404);
            if (!userResult) throw new AppError("Anda belum memulai ujian ini", 403);

            // 2. Cek Status (Sudah Submit atau Belum)
            if (userResult.status === TestResultStatus.SUBMITTED) {
                throw new AppError("Ujian sudah selesai disubmit. Akses ditolak.", 403);
            }

            // 3. Cek Waktu (Durasi)
            const startTime = new Date(userResult.startedAt).getTime();
            const now = Date.now();
            const durationMs = (exam.durationMinutes ?? 0) * 60 * 1000;
            const toleranceMs = 30 * 1000; // Toleransi latency 30 detik

            if (now > (startTime + durationMs + toleranceMs)) {
                // Logika industri: Jika telat, bisa otomatis trigger submit di sini
                // atau cukup kembalikan error agar frontend yang menanganinya
                throw new AppError("Waktu ujian telah berakhir.", 403);
            }

            // Jika semua oke, lanjut ke controller
            next();
        } catch (error) {
            next(error);
        }
    };
};