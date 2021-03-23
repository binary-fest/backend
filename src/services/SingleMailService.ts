import * as nodemailer from 'nodemailer';
import * as template from '../templates';

interface mailDataObj{
  mailtype: string, 
  subject: string, 
  receiver: string, 
  maildata: object
}

export const SingleMailService = async ({mailtype, subject, receiver, maildata}: mailDataObj) => {

  // Email transport 
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  })

  return await transporter.sendMail({
      from: '"BinaryFest" <binaryfest.uty@gmail.com>', // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: template[mailtype](maildata) // html body
    })

}