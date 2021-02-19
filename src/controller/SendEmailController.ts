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

    MailService('Pendaftaran Peserta', 'register', ['bagusfarizky89@gmail.com', 'btstargroup@gmail.com'])
      .then(success => console.log(success))
      .catch(err => console.log(err))
      
  }
}