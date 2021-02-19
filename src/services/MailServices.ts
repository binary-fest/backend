// import * as nodemailer from 'nodemailer';

export const MailService = async (mailSubject: string, template: string, receiver: Array<string>) => {

  // let transporter = nodemailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: process.env.MAIL_USER, // generated ethereal user
  //     pass: process.env.MAIL_PASS, // generated ethereal password
  //   },
  // });

  // return await transporter.sendMail({
  //     from: '"BinaryFest" <noreply@binaryfest.or.id>', // sender address
  //     to: receiver.join(", "), // list of receivers
  //     subject: mailSubject, // Subject line
  //     html: "<h2>Selamat datang di Dunia Binatang!</h2>", // html body
  //   })
}