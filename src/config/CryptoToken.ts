import * as CryptoJS from "crypto-js";
import config from "./config";

const dateFix = (date: number) => {
  return (date < 10) ? `0${date}` : `${date}`
} 

export const generateToken = (email: String) => {
  const recentDate = new Date(Date.now());
  // definisi tanggal token
  const start = `${recentDate.getFullYear()}-${dateFix(recentDate.getMonth()+1)}-${dateFix(recentDate.getDate())}`
  // set token, token berlaku selama 7 hari
  recentDate.setDate(recentDate.getDate() + 7) 
  // definisi tanggal expired token
  const expired = `${recentDate.getFullYear()}-${dateFix(recentDate.getMonth()+1)}-${dateFix(recentDate.getDate())}`

  // Data yang akan di generate menjadi token, di beri pemisah "/"
  const tokenData = `${email}/${start}/${expired}`

  // enkripsi token dengan algoritma AES dari CryptoJS
  const tokenEncrypt = CryptoJS.Rabbit.encrypt(
    tokenData,
    process.env.subKeyToken || config.subKeyToken,
    {
      mode: CryptoJS.mode.ECB
    }
  ).toString();

  // dari AES, token akan digenerate menjadi Base64
  const token = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(tokenEncrypt))

  // return array 
  return [ token, start, expired ]
}

export const decryptToken = async (token: any) => {
  // return new Promise((resolve, reject) => {

  // })
  const parseToken = await CryptoJS.enc.Base64.parse(token)
  let parseStr, tokenDecrypt: any;
  
  try{
    parseStr = parseToken.toString(CryptoJS.enc.Utf8)

    tokenDecrypt = CryptoJS.Rabbit.decrypt(
      parseStr,
      process.env.subKeyToken || config.subKeyToken,
      {
        mode: CryptoJS.mode.ECB
      }
    ).toString(CryptoJS.enc.Utf8)
  } catch(error){
    throw new Error(error);
  }

  return tokenDecrypt
}