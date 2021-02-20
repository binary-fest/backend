import { NextFunction, Request, Response } from "express";
import { MailService } from "../services/MailServices";


// Request for send mail
/**
 * {
 *  template: "register",
 *  receiver: ["bagusfarizky89@gmail.com", "example1@gmail.com", "example2@gmail.com"]
 * }
 */

export class SendEmailController {
  async send(req:Request, res:Response) {

    const mailData = {
      subject: "Pendaftaran BinaryFest2021",
      data: {
        textHeader: 'Selamat Datang bagus Trianurdin',
        textBody: 'Ini adalah body dari email',
        textFooter: "Ini adalah footer dari email"
      }
    }

    MailService(mailData, 'registration', ['bagusfarizky89@gmail.com', 'btstargroup@gmail.com'])
      .then(result => {
        res.status(200).json({
          message: 'Send email success'
        })
      })
      .catch(err => {
        console.log(err);
      })
      
  }
}