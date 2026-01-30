import { userService } from "../container";
import { redisConnection } from "../utils/redis-connection";
import { ExamWorker } from "./exam.worker";


export const examWorker = new ExamWorker(userService,redisConnection)