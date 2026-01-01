import * as v from 'valibot';

export type CreateAccountType = {
    username: string,
    password: string
}


export const CreateAccount = v.object({
    username: v.string(),
    password: v.string(),

})