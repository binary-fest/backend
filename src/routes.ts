import { AuthController } from "./controller/AuthController";
import { TeamController } from "./controller/TeamController";
import { checkJwt } from "./middleware/checkJwt";
import { checkRole } from './middleware/checkRole'
import { noCheck } from "./middleware/noCheck";

export const Routes = [
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
    route: "/api/competition/iot/register",
    controller: TeamController,
    action: "registerIot"
}

];