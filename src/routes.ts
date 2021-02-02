import { AuthController } from "./controller/AuthController";
import {UserController} from "./controller/UserController";
import { checkJwt } from "./middleware/checkJwt";
import { checkRole } from './middleware/checkRole'

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    middleware: [checkJwt]
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, 

// auth routes

{
    method: "post",
    route: "/auth/login",
    controller: AuthController,
    action: "login"
}, {
    method: "post",
    route: "/auth/register",
    controller: AuthController,
    action: "register"
}

];