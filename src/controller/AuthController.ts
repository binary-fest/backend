import {getRepository} from "typeorm";
import * as jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import { Auth, Role } from "../entity/Auth";
import config from '../config/config'

export class AuthController {

  private userRepository = getRepository(Auth);

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    
    if(!(username && password)){
      res.status(400).send()
    }

    let user: Auth
    try {
      user = await this.userRepository.findOneOrFail({
        where: {
          username
        }
      })
    } catch (error) {
      res.status(401).json({
        message: error.message,
        error
      })
    }

    if(!user.checkIfUnencryptedPasswordIsValid(password)){
      res.status(401).json({
        message: "UnencryptedPasswordIsNotValid"
      })
      return
    }

    const token = jwt.sign(
      { username: user.username},
      config.jwtSecret,
      {expiresIn: "3h"}
    )

    res.status(200).json({
      token
    })
  }

  async register(req: Request, res: Response, next: NextFunction){
    const { username, password, role} = req.body

    let user = new Auth()
    user.username = username
    user.password = password
    user.role = role

    const extractRole = Object.keys(Role)

    if (!extractRole.includes(role)) {
      res.status(400).json({
        message: "invalid role"
      })
      return;
    }

    user.hashPassword()
    
    await this.userRepository.findOneOrFail({
      where: {
          username
      }
    })
    .then(() => {
      res.status(409).json({
          message: "username already in use"
      })
    })
    .catch(async () => {
      await this.userRepository.save(user)
      .then(() => {
        res.status(200).json({
          message: "username was created"
        })
      })
      .catch((error) => {
        res.status(400).json({
          message: "error occured",
          error: error.message
        })
      })
    })

  }
}