import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../config/jwt";


interface UserPayload {
    id: string;
    username: string;
    role: string;
    position: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const decoded = verifyAccessToken(token)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}


export const roleMiddleware = (role: string) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user || user.role !== role) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    next()
}