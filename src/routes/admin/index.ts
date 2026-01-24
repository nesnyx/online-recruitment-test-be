import express, { Request, Response, NextFunction } from "express";
import { authMiddleware} from "../../modules/middleware/auth";
import { adminExamAccountService} from "../../container";
import { exam } from "./exam.route";
import { position } from "./position.route";
import { account } from "./account.route";
import { option } from "./option.route";
import { question } from "./question.route";
import { examResult } from "./exam-result.route";



export const admin = express.Router()
admin.use(authMiddleware(adminExamAccountService))
admin.use("/exams",exam)
admin.use("/positions",position)
admin.use("/accounts",account)
admin.use("/options",option)
admin.use("/questions",question)
admin.use("/",examResult)










