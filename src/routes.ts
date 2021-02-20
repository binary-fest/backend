import { AuthController } from "./controller/AuthController";
import { HomeController } from "./controller/HomeController";
import { TeamController } from "./controller/TeamController";
import { TestController } from "./controller/TestController";
import { SendEmailController } from "./controller/SendEmailController";
import { checkJwt } from "./middleware/checkJwt";
import { checkRole } from './middleware/checkRole'
import { noCheck } from "./middleware/noCheck";

export const Routes = [
    // home routes
    {
        method: "get",
        route: "/",
        controller: HomeController,
        action: "index",
        middleware: noCheck
    },

    // auth routes
    {
        method: "post",
        route: "/api/auth/login",
        controller: AuthController,
        action: "login",
        middleware: noCheck
    }, {
        method: "post",
        route: "/api/auth/register",
        controller: AuthController,
        action: "register"
    },

    // team routes
    {
        method: "post",
        route: "/api/competition/register",
        controller: TeamController,
        action: "register"
    },

    // send email routes
    {
        method: "post",
        route: "/api/test/send-email",
        controller: SendEmailController,
        action: "send"
    }
];