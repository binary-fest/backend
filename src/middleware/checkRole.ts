  
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { Auth } from "../entity/Auth";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const username = res.locals.jwtPayload.username;

    //Get user role from the database
    const userRepository = getRepository(Auth);
    let user: Auth;
    try {
      user = await userRepository.findOneOrFail(username);
    } catch (username) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};