import {NextFunction, Request, Response} from "express";
import { SingleMailService } from "../services/SingleMailService";

export class TestController{

    async sendmail(req: Request, res: Response){
        const { email } = req.params

        await SingleMailService({
            mailtype: 'reg_approved',
            subject: "Informasi Pendaftaran",
            receiver: email,
            maildata: {name: email.split("@")[0]}
        })
        .then(() => {
            res.status(200).json({
                status: 200,
                message: 'Email sended. Check your email!'
            })
        })
        .catch(() => {
            res.status(400).json({
                status: 400,
                message: "Email failed to send!"
            })
        })
    }

}