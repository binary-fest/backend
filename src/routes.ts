import { AuthController } from "./controller/AuthController";
import { HomeController } from "./controller/HomeController";
import { TeamController } from "./controller/TeamController";
import { TestController } from "./controller/TestController";
import { checkJwt } from "./middleware/checkJwt";
import { checkRole } from './middleware/checkRole'
import { noCheck } from "./middleware/noCheck";

export const Routes = [
// test routes
{
    method: "post",
    route: "/api/test/cloudinary",
    controller: TestController,
    action: "testCloudinary",
    middleware: noCheck
},

// home routes
{
    method: "get",
    route: "/",
    controller: HomeController,
    action: "login",
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
}

];