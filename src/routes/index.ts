import express from "express"
import { auth } from "./auth"
import { admin } from "./admin"
import { user } from "./user"

export const router = express.Router()


router.use("/auth", auth)
router.use("/admin", admin)
router.use("/user", user)

router.get("/health", (req, res) => {
    res.json({
        meessage: "ok"
    })
})