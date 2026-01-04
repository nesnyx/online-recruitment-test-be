import * as v from "valibot";

export const ExamSchema = v.pipe(
    v.object({
        title: v.pipe(
            v.string(),
            v.minLength(4),
            v.maxLength(50)
        ),

        description: v.pipe(
            v.string(),
            v.minLength(4),
            v.maxLength(100)
        ),

        durationMinutes: v.pipe(
            v.number(),
            v.integer(),
            v.minValue(1) // pengganti positive()
        ),

        // startAt: v.pipe(
        //     v.date(),
        //     v.custom(
        //         (date: any) => date.getTime() > Date.now(),
        //         () => "startAt must be in the future"
        //     )
        // ),

        // endAt: v.pipe(
        //     v.date(),
        //     v.custom(
        //         (date: any) => date.getTime() > Date.now(),
        //         () => "endAt must be in the future"
        //     )
        // ),
    }),

    // validasi antar field
    // v.custom(
    //     (data: any) => data.endAt.getTime() > data.startAt.getTime(),
    //     () => "endAt must be later than startAt"
    // )
);




export const GenerateAccountSchema = v.object({
    username: v.pipe(
        v.string(),
        v.minLength(4),
        v.maxLength(20)
    ),

    email: v.pipe(
        v.string(),
        v.email()
    ),
});