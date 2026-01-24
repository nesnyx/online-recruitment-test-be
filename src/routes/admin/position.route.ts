import express, { Request, Response, NextFunction } from "express";
import { adminPositionService } from "../../container";
import { AppError } from "../../utils/app-error";


export const position = express.Router()

position.get("/", async (req: Request, res: Response) => {
    try {
        const positions = await adminPositionService.getAllPositions()
        res.status(200).json({
            success: true,
            data: positions
        })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

position.get("/:id", async (req: Request, res: Response) => {
    try {
        const positionId = req.params.id
        const position = await adminPositionService.getPositionById(positionId)
        res.status(200).json({
            success: true,
            data: position
        })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

position.post("/", async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const position = await adminPositionService.createPosition(name)
        res.status(200).json({
            success: true,
            data: position
        })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

position.delete("/:id", async (req: Request, res: Response) => {
    try {
        const positionId = req.params.id
        await adminPositionService.deletePositionById(positionId)
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})

position.patch("/:id", async (req: Request, res: Response) => {
    try {
        const positionId = req.params.id
        const { name } = req.body
        const updatedPosition = await adminPositionService.updatePositionById(positionId, name)
        res.status(200).json({
            success: true,
            data: updatedPosition
        })
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
})
