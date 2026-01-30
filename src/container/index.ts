import { Test } from "../config/database/models/Exam";
import { ExamAccounts } from "../config/database/models/ExamAccounts";
import { TestResult } from "../config/database/models/ExamResult";
import { Option } from "../config/database/models/Option";
import { Position } from "../config/database/models/Position";
import { Question } from "../config/database/models/Question";
import { QuestionAnswer } from "../config/database/models/QuestionAnswer";
import { User } from "../config/database/models/User";
import { AdminExamAccountRepository } from "../modules/admin/repository/admin.exam-account.repository";
import { AdminExamRepository } from "../modules/admin/repository/admin.exam.repository";
import { AdminOptionRepostory } from "../modules/admin/repository/admin.option.repository";
import { AdminPositionRepository } from "../modules/admin/repository/admin.position.repository";
import { AdminQuestionRepository } from "../modules/admin/repository/admin.question.repository";
import { AdminResultsRepository } from "../modules/admin/repository/admin.results.repository";
import { AdminUserRepository } from "../modules/admin/repository/admin.user.repository";
import { AdminExamAccountService } from "../modules/admin/services/admin.exam-account.service";
import { AdminExamService } from "../modules/admin/services/admin.exam.service";
import { AdminOptionService } from "../modules/admin/services/admin.option.service";
import { AdminPositionService } from "../modules/admin/services/admin.position.service";
import { AdminQuestionService } from "../modules/admin/services/admin.question.service";
import { AdminResultService } from "../modules/admin/services/admin.results.service";
import { AdminEventListener } from "../modules/admin/services/admin.send-invitation.listener";
import { SendInvitationService } from "../modules/admin/services/admin.send-invitation.service";
import { AdminUserService } from "../modules/admin/services/admin.user.service";
import { UserRepository } from "../modules/user/repository/user.repository";
import { UserEventListener } from "../modules/user/services/user.listener";
import { UserService } from "../modules/user/services/user.service";


const adminPositionRepository = new AdminPositionRepository(Position)

const adminExamRepository = new AdminExamRepository(Test, Position)
export const adminExamService = new AdminExamService(adminExamRepository,adminPositionRepository)
export const adminPositionService = new AdminPositionService(adminPositionRepository)
const adminUserRepository = new AdminUserRepository(User, Position)
export const adminUserService = new AdminUserService(adminUserRepository)
const adminOptionRepository = new AdminOptionRepostory(Option)
export const adminOptionService = new AdminOptionService(adminOptionRepository)
const adminQuestionRepository = new AdminQuestionRepository(Question,Option,Test)
export const adminQuestionService = new AdminQuestionService(adminQuestionRepository,adminOptionService)
const adminResultRepository =new AdminResultsRepository(User, Test, TestResult)
export const adminResultService = new AdminResultService(adminResultRepository)
const adminExamAccountRepository = new AdminExamAccountRepository(ExamAccounts)
export const adminExamAccountService = new AdminExamAccountService(adminExamAccountRepository)
export const sendInvitation = new SendInvitationService(adminExamRepository,adminUserRepository)
const userRepository = new UserRepository(User, QuestionAnswer, TestResult, Question, Test, Option)
export const userService = new UserService(userRepository,adminQuestionService,adminExamService)
export const adminEventListener = new AdminEventListener(adminExamAccountService)
export const userEventListener = new UserEventListener(userRepository)