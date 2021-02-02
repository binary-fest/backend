import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the heads
  const token = <string>req.headers["auth"];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    
    jwtPayload = <any>jwt.verify(token, process.env.API_KEY || config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //The token is valid for 3 hour
  //We want to send a new token on every request
  const { username } = jwtPayload;
  const newToken = jwt.sign({ username }, config.jwtSecret, {
    expiresIn: "3h"
  });
  res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};