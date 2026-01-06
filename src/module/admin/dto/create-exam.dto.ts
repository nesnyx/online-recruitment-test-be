export type CreateExamType = {
    title: string,
    description?: string,
    startAt: Date,
    endAt: Date,
    durationMinutes?: number,
    category?: string
}