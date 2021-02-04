import { Request, Response, NextFunction } from "express";

export const noCheck = (req: Request, res: Response, next: NextFunction) => {
    next()
}