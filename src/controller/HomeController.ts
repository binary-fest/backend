import { NextFunction, Request, Response } from "express";

export class HomeController {
  async index(req: Request, res: Response){
    res.status(200).json({
      message: "REST API BinaryFest 2021",
      text: "Thanks for support"
    })
  }
}