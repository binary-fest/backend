import { AuthController } from "./controller/AuthController";
import { HomeController } from "./controller/HomeController";
import { TeamController } from "./controller/TeamController";
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
    {
        method: "put",
        route: "/api/team/status",
        controller: TeamController,
        action: "status",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    },
    {
        method: "get",
        route: "/api/team/members",
        controller: TeamController,
        action: "allMembers",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    },
    {
        method: "get",
        route: "/api/team/submissions",
        controller: TeamController,
        action: "allSubmissions",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    }
];