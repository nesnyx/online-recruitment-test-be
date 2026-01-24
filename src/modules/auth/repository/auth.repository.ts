import { Admin } from "../../../config/database/models/Admin"
import { User } from "../../../config/database/models/User"
import { AppError } from "../../../utils/app-error"
import { AuthDto } from "../dto/auth.dto"



export interface IAuthRepository {
    loginAdmin(payload: AuthDto): Promise<Admin>
    loginUser(payload: AuthDto): Promise<User>
    registerAdmin(payload: AuthDto): Promise<Admin>
}

export class AuthRepository implements IAuthRepository {
    constructor(private admin: typeof Admin, private user: typeof User) { }
    async loginAdmin(payload: AuthDto): Promise<Admin> {
        const admin = await this.admin.findOne({ where: { username: payload.username } })
        if (!admin) {
            throw new AppError('Admin not found', 404)
        }
        if (admin.password != payload.password) {
            throw new AppError('Invalid password', 401)
        }
        return admin
    }

    async loginUser(payload: AuthDto): Promise<User> {
        const user = await this.user.findOne({ where: { username: payload.username } })
        if (!user) {
            throw new AppError('User not found', 404)
        }
        if (user.password != payload.password) {
            throw new AppError('Invalid password', 401)
        }
        return user
    }
    async registerAdmin(payload: AuthDto): Promise<Admin> {
        return await this.admin.create({
            username: payload.username,
            password: payload.password,
        })
    }
}   