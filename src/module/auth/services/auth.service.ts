import { generateTokens } from "../../../config/jwt";
import { AppError } from "../../../utils/app-error";
import { IAdminRepository } from "../../admin/entity/admin.entity";
import { AuthDto } from "../dto/auth.dto";
import { IAuthRepository } from "../entity/auth.entity";

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export class AuthService {
    constructor(private authRepository: IAuthRepository, private adminRepository: IAdminRepository) { }

    async loginAdmin(payload: AuthDto) {
        const account = await this.authRepository.loginAdmin(payload)
        if (!account) {
            throw new AppError('Account not found', 404)
        }
        const generateToken = generateTokens(account.id, account.username, Role.ADMIN)
        return generateToken

    }

    async loginUser(payload: AuthDto) {
        const account = await this.authRepository.loginUser(payload)
        if (!account) {
            throw new AppError('Account not found', 404)
        }
        const position = await this.adminRepository.findPositionById(account.positionId)
        const generateToken = generateTokens(account.id, account.name, Role.USER, position.name)
        return generateToken
    }
    async registerAdmin(payload: AuthDto) {
        const account = await this.authRepository.registerAdmin(payload)
        if (!account) {
            throw new AppError('Account not found', 404)
        }
        return account
    }
}

