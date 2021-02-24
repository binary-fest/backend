import * as nodemailer from 'nodemailer';
import * as allSettled  from 'promise.allsettled';
import * as template from '../templates';

interface mailData{
  mailType: string;
  subject: string;
  receiver: any;
}

export const MailService = async (mailData: mailData) => {

  const {mailType,subject,receiver} = mailData;

  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });

  const mailPromise = [];

  receiver.forEach((_data: any) => {
    mailPromise.push(new Promise((resolve, reject) => {
      transporter.sendMail({
        from: '"BinaryFest" <noreply@binaryfest.or.id>', // sender address
        to: _data.address, // list of receivers
        subject: subject, // Subject line
        html: template[mailType](_data.data), // html body
      }, (err, info) => {
        if(err){
          reject(_data.address)
        } else {
          resolve(_data.address)
        }
      })
    }))
  })
  
  return allSettled(mailPromise)

}