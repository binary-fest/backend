import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as compression from "compression"
import * as cloudinary from 'cloudinary'
import * as rateLimit from 'express-rate-limit'
import * as dotenv from 'dotenv'
import {Routes} from "./routes";
import config from "./config/config";

dotenv.config()

const cloudinaryV2 = cloudinary.v2

cloudinaryV2.config(config.cloudinary)

createConnection().then(async connection => {
    // create express app
    const app = express();
    app.use(cors({
        origin: process.env.NODE_ENV === 'pruduction' ? "https://binaryfest.or.id" : "*"
    }));
    app.use(compression())
    app.use(helmet());
    app.use(bodyParser.json({limit: "5mb"}));
    app.use(rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 10
    }))

    // register express routes from defined application routes
    const nextFunc = (req: Request, res: Response, next: Function) => {next()}
    Routes.forEach(route => {
        (app as any)[route.method](
            route.route, 
            route.middleware !== undefined ? route.middleware : nextFunc, 
            (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            }
        );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(process.env.PORT || 3000);

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
