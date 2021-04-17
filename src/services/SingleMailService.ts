import * as nodemailer from 'nodemailer';
import { MailTemplateObj } from '../model/MailTemplateObj';
import MailTemplate from '../templates/MailTemplate';

interface mailDataObj{
  subject: string, 
  receiver: string, 
  maildata: MailTemplateObj
}

export const SingleMailService = async ({subject, receiver, maildata}: mailDataObj) => {

  // Email transport 
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  })

  return await transporter.sendMail({
      from: '"BinaryFest" <binaryfest.uty@gmail.com>', // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: MailTemplate(maildata) // html body
    })

}