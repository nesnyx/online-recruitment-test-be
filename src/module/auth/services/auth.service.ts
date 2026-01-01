import { generateTokens } from "../../../config/jwt";
import { AppError } from "../../../utils/app-error";
import { AuthDto } from "../dto/auth.dto";
import { IAuthRepository } from "../entity/auth.entity";

enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export class AuthService {
    constructor(private authRepository: IAuthRepository) { }

    async loginAdmin(payload: AuthDto) {
        const account = await this.authRepository.loginAdmin(payload)
        if (!account) {
            throw new AppError('Account not found')
        }
        const generateToken = generateTokens(account.id, account.username, Role.ADMIN)
        return generateToken

    }

    async loginUser(payload: AuthDto) {
        const account = await this.authRepository.loginUser(payload)
        if (!account) {
            throw new AppError('Account not found')
        }
        const generateToken = generateTokens(account.id, account.name, Role.USER)
        return generateToken
    }
    async registerAdmin(payload: AuthDto) {
        const account = await this.authRepository.registerAdmin(payload)
        if (!account) {
            throw new AppError('Account not found')
        }
        return account
    }
}

