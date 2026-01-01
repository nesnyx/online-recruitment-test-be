import express from "express"
import { auth } from "./auth"
import { admin } from "./admin"

export const router = express()


router.use("/auth", auth)
router.use("/admin", admin)