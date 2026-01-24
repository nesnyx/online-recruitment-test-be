import * as v from 'valibot';

export type CreateScheduleType = {
    timestamp: number,
    userId: number
}

export const CreateSchedule = v.object({
    timestamp: v.number(),
    userId: v.number()
})