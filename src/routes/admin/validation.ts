import { z } from 'zod';


const ExamBaseSchema = z.object({
    title: z.string()
        .min(5, "Title minimal 5 karakter")
        .max(100, "Title maksimal 100 karakter"),
    description: z.string()
        .max(500, "Deskripsi maksimal 500 karakter")
        .optional(),
    startAt: z.coerce.date({ message: "Format tanggal startAt tidak valid" }),
    endAt: z.coerce.date({ message: "Format tanggal endAt tidak valid" }),
    durationMinutes: z.number()
        .int()
        .positive("Durasi harus angka positif")
        .min(1, "Minimal durasi adalah 1 menit")
});




export const CreateExamSchema = ExamBaseSchema.refine(
    (data) => new Date(data.endAt) > new Date(data.startAt),
    {
        message: "Waktu selesai (endAt) harus lebih besar dari waktu mulai (startAt)",
        path: ["endAt"],
    }
);


export const UpdateExamSchema = ExamBaseSchema.partial().refine(
    (data) => {
        if (data.startAt && data.endAt) {
            return new Date(data.endAt) > new Date(data.startAt);
        }
        return true;
    },
    {
        message: "Waktu selesai (endAt) harus lebih besar dari waktu mulai (startAt)",
        path: ["endAt"],
    }
);




export type CreateExamInput = z.infer<typeof CreateExamSchema>;
export type UpdateExamInput = z.infer<typeof UpdateExamSchema>;