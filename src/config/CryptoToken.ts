import * as CryptoJS from "crypto-js";
import config from "./config";

export const generateToken = (email: String, date: Number) => {
  const recentDate = new Date(date as any);
  // definisi tanggal token
  const start = `${recentDate.getFullYear()}-${recentDate.getMonth()}-${recentDate.getDate()}`
  // set token, token berlaku selama 7 hari
  recentDate.setDate(recentDate.getDate() + 14) 
  // definisi tanggal expired token
  const expired = `${recentDate.getFullYear()}-${recentDate.getMonth()}-${recentDate.getDate()}`

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

export const decryptToken = (token: any) => {
  const parseToken = CryptoJS.enc.Base64.parse(token)
  const parseStr = parseToken.toString(CryptoJS.enc.Utf8);

  const tokenDecrypt = CryptoJS.Rabbit.decrypt(
    parseStr,
    process.env.subKeyToken || config.subKeyToken,
    {
      mode: CryptoJS.mode.ECB
    }
  ).toString(CryptoJS.enc.Utf8)

  return tokenDecrypt
}