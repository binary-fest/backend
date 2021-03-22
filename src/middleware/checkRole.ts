  
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { AdminAccount } from "../entity/AdminAccount";
 
export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const username = res.locals.jwtPayload.username;

    //Get user role from the database
    const userRepository = getRepository(AdminAccount);
    let user: AdminAccount;
    try {
      user = await userRepository.findOneOrFail(username);
    } catch (username) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) {
      res.locals.userRole = user.role
      next();
    } else {
      res.status(401).send();
    }  
  };
};