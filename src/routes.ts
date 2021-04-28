import { AuthController } from "./controller/AuthController";
import { HomeController } from "./controller/HomeController";
import { TeamController } from "./controller/TeamController";
import { checkJwt } from "./middleware/checkJwt";
import { checkRole } from './middleware/checkRole'
import { noCheck } from "./middleware/noCheck";
import { TestController } from "./controller/TestController";

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
        action: "putStatus",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    },
    // Team submission
    {
        method: "post",
        route: "/api/submission",
        controller: TeamController,
        action: "nextSubmission",
        middleware: noCheck
    },
    // Token Submission check
    {
        method: "get",
        route: "/api/submission/token",
        controller: TeamController,
        action: "checkToken",
        middleware: noCheck
    },
    {
        method: "get",
        route: "/api/submission/:type",
        controller: TeamController,
        action: "getTeamBySubmission",
        middleware: [checkJwt, checkRole(['uiux', 'iot'])]
    },
];