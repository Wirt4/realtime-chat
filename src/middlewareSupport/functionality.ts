import { getToken } from "next-auth/jwt";
import { Handler } from "@/middlewareSupport/handler/handler";
import { NextRequest } from "next/server";
import { IHandler } from "@/middlewareSupport/handler/interface"
import { handlerFactory } from "./handler/factory";

export class Middleware {
    //two injections: an authenticator class and the handler class


    async processRequest(req: NextRequest) {
        const handler: IHandler = handlerFactory()
        const JWT = await getToken({ req });
        handler.setRequest(req)
        handler.setJWT(JWT)

        if (handler.isAccessingSensitiveRoute() && !handler.isAuthenticated()) {
            return handler.redirectToLogin();
        }

        if (handler.isLogin()) {
            if (handler.isAuthenticated()) {
                return handler.redirectToDashboard()
            }
            return handler.next();
        }

        if (handler.isPointingToHome()) {
            return handler.redirectToDashboard();
        }
    }
}
