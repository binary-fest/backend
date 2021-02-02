import {getRepository} from "typeorm";
import * as jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

import { User } from "../entity/User";
import config from '../config/config'
import { validate } from "class-validator";

export class AuthController {

    private userRepository = getRepository(User);

    async login(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body
        if(!(username && password)){
            res.status(400).send()
        }

        let user: User
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

        let user = new User()
        user.username = username
        user.password = password
        user.role = role
        
        const errors = await validate(user)
        if (errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }

        user.hashPassword()

        try {
            await this.userRepository.save(user)
        } catch (error) {
            res.status(409).json({
                message: "Username already in use"
            })
        }

        res.status(201).json({
            message: "User created"
        })
    }

    // async logout(req: Request, res: Response, next: NextFunction){

    // }

}