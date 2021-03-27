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
        method: "get",
        route: "/api/teams",
        controller: TeamController,
        action: "getTeams",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    },
    {
        method: "get",
        route: "/api/team/:teamId",
        controller: TeamController,
        action: "getTeamId",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    },
    {
        method: "put",
        route: "/api/team/status",
        controller: TeamController,
        action: "status",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    },
    //Token checker
    {
        method: "get",
        route: "/api/submission/check",
        controller: TeamController,
        action: "checkToken",
        middleware: noCheck
    }
];