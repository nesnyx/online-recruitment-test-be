import { Request, Response, NextFunction } from 'express';
import { TestResultStatus } from '../../config/database/models/ExamResult';
import { AppError } from '../../utils/app-error';
import { UserRepository } from '../user/entity/user.entity';
import { AdminRepository } from '../admin/entity/admin.entity';
import { sequelize } from '../../config/database/database';

export const isExamActive = (userRepository: UserRepository, adminRepository: AdminRepository) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const { examId } = req.params;
            if (!userId) throw new AppError("Unauthorized", 401);
            const transaction = await sequelize.transaction()
            const [exam, userResult] = await Promise.all([
                adminRepository.findExamByID(examId),
                userRepository.findExamResultsByUserId(userId, examId, transaction)
            ]);

            if (!exam) throw new AppError("Ujian tidak ditemukan", 404);
            if (!userResult) throw new AppError("Anda belum memulai ujian ini", 403);


            if (userResult.status === TestResultStatus.SUBMITTED) {
                throw new AppError("Ujian sudah selesai disubmit. Akses ditolak.", 403);
            }


            const startTime = new Date(userResult.startedAt).getTime();
            const now = Date.now();
            const durationMs = (exam.durationMinutes ?? 0) * 60 * 1000;
            const toleranceMs = 30 * 1000;

            if (now > (startTime + durationMs + toleranceMs)) {
                throw new AppError("Waktu ujian telah berakhir.", 403);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};