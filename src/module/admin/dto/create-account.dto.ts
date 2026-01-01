import * as v from 'valibot';

export type CreateAccountType = {
    name: string,
    password: string,
    email: string
}


export const CreateAccount = v.object({
    username: v.string(),
    password: v.string(),

})