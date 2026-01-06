import { z } from 'zod';

// 1. Definisikan Base Object (Hanya field dan tipe datanya)
const ExamBaseSchema = z.object({
    title: z.string()
        .min(5, "Title minimal 5 karakter")
        .max(100, "Title maksimal 100 karakter"),
    description: z.string()
        .max(500, "Deskripsi maksimal 500 karakter")
        .optional(),
    startAt: z.string().datetime({ message: "Format tanggal startAt tidak valid" }),
    endAt: z.string().datetime({ message: "Format tanggal endAt tidak valid" }),
    durationMinutes: z.number()
        .int()
        .positive("Durasi harus angka positif")
        .min(1, "Minimal durasi adalah 1 menit")
});

// 2. Schema untuk CREATE (Wajib semua & ada Refine)
export const CreateExamSchema = ExamBaseSchema.refine(
    (data) => new Date(data.endAt) > new Date(data.startAt),
    {
        message: "Waktu selesai (endAt) harus lebih besar dari waktu mulai (startAt)",
        path: ["endAt"],
    }
);

// 3. Schema untuk UPDATE (Partial & ada Refine jika field dikirim)
export const UpdateExamSchema = ExamBaseSchema.partial().refine(
    (data) => {
        // Hanya jalankan pengecekan jika KEDUA field dikirim dalam request PATCH
        if (data.startAt && data.endAt) {
            return new Date(data.endAt) > new Date(data.startAt);
        }
        return true; // Jika hanya salah satu atau tidak ada, lewati validasi ini
    },
    {
        message: "Waktu selesai (endAt) harus lebih besar dari waktu mulai (startAt)",
        path: ["endAt"],
    }
);

// Type Inference
export type CreateExamInput = z.infer<typeof CreateExamSchema>;
export type UpdateExamInput = z.infer<typeof UpdateExamSchema>;