import {NextFunction, Request, Response} from "express";
import * as cloudinary from 'cloudinary'
const cloudinaryV2 = cloudinary.v2

export class TestController{

    async testCloudinary(req: Request, res: Response, next: NextFunction){
        const { url } = req.body

        await cloudinaryV2.uploader.upload(url, {
            folder: "web/test"
        })
        .then((result) => {
            res.status(200).json({
                message: "success",
                result: result
            })
        })
        .catch((error) => {
            res.status(400).json({
                message: "error",
                result: error
            })
        })

    }

}