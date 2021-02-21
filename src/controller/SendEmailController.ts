import { fail } from "assert";
import { NextFunction, Request, Response } from "express";
import { MailService } from "../services/MailServices";

export class SendEmailController {
  async send(req:Request, res:Response) {
    const {mailType, subject, receiver } = req.body

    const mailData = {
      mailType,
      subject,
      receiver
    }

    if (receiver.length > 20) {
      res.status(400).json({
        message: 'Max email recipients are 20'
      })
      return;
    }

    MailService(mailData)
      .then(result => {
        const failedSend = [];
        const successSend = [];

        result.forEach(mail => {
          if (mail.status === 'rejected') {
            failedSend.push(mail.reason)
          } 
          if (mail.status === 'fulfilled'){
            successSend.push(mail.value)
          }
        })

        if (successSend.length === 0) {
          res.status(400).json({
            message: 'No email was sent'
          })
          return;
        }
        
        res.status(200).json({
          message: 'Email was sent',
          success: successSend,
          failed: failedSend
        })
      })
      
  }
}