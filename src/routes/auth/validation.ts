import * as v from "valibot"


const UsernameSchema = v.pipe(
    v.string(),
    v.minLength(4),
    v.maxLength(20),
    v.custom(
        (v: any) => !/\s/.test(v),
        () => "Username must not contain spaces"
    )
);

const PasswordSchema = v.pipe(
    v.string(),
    v.minLength(8),
    v.maxLength(20)
);

export const LoginSchema = v.object({
    username: UsernameSchema,
    password: PasswordSchema,
});

export const RegisterSchema = v.object({
    username: UsernameSchema,
    password: PasswordSchema,
});