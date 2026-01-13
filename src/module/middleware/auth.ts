import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../config/jwt";
import { AdminService } from "../admin/services/admin.service";


interface UserPayload {
    id: string;
    username: string;
    role: string;
    position: string;
    examId?: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const authMiddleware = (adminService: AdminService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];

            if (!token) {
                return res.status(401).json({ message: "Unauthorized: No token provided" });
            }

            const decoded = verifyAccessToken(token);
            req.user = decoded;

            // POTENSI STUCK: Pastikan method ini memiliki try-catch internal atau timeout
            const examAccount = await adminService.findExamAccountByUserId(decoded.id);

            if (examAccount) {
                req.user.examId = examAccount.examId;
            }

            // Pastikan ini terpanggil
            return next();
        } catch (error: any) {
            console.error("Auth Middleware Error:", error);

            // Jika error karena JWT expired/invalid
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            // Jika error karena database/service (ini yang bikin pending kalau tidak dihandle)
            return res.status(500).json({ message: "Internal Server Error in Auth" });
        }
    };
}


export const roleMiddleware = (role: string) => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user || user.role !== role) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    next()
}