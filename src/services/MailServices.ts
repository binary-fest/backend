import * as nodemailer from 'nodemailer';
import * as mustance from 'mustache';
import { readFileSync } from 'fs';
import { join } from 'path';

interface mailData{
  subject: string;
  data: any;
}

export const MailService = async (mailData: mailData, template: string, receiver: Array<string>) => {

  const mailTemplate = readFileSync(join(__dirname,`/templates/mail-${template}.mustache`), 'utf8')  

  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });

  return new Promise((resolve: any, reject: any) => {
    
    try {
      const mailMap = receiver.map(async rec => {
        return await transporter.sendMail({
          from: '"BinaryFest" <noreply@binaryfest.or.id>', // sender address
          to: rec, // list of receivers
          subject: mailData.subject, // Subject line
          html: mustance.render(mailTemplate, mailData.data), // html body
        })
      });

      resolve('Success send email');
    } catch (error) {
      reject('Failed send email')
    }

  })

  // return await transporter.sendMail({
  //     from: '"BinaryFest" <noreply@binaryfest.or.id>', // sender address
  //     to: receiver.join(", "), // list of receivers
  //     subject: mailData.subject, // Subject line
  //     html: mustance.render(mailTemplate, mailData.data), // html body
  //   })
}