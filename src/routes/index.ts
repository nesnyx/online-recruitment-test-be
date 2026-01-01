import express from "express"
import { auth } from "./auth"

export const router = express()


router.use("/auth", auth)
