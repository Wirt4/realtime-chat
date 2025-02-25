import { NextRequest } from "next/server";
import { IRouteHandler } from "@/services/middleware/handler/interface"
import { IAuthenticator } from "@/services/middleware/authenticator/interface";
import { handlerFactory } from "@/services/middleware/handler/factory"
import { authenticatorFactory } from "@/services/middleware/authenticator/factory";

export class Middleware {

    async processRequest(req: NextRequest) {
        const dashboard = '/dashboard'
        const login = '/login'
        const home = '/'

        const authenticator: IAuthenticator = authenticatorFactory()
        await authenticator.fetchJWT(req)
        const handler: IRouteHandler = handlerFactory(req, dashboard)

        if (handler.isAccessingProtectedroute() && !authenticator.isValid()) {
            return handler.redirectTo(login);
        }

        if (handler.isPointingTo(login)) {
            if (authenticator.isValid()) {
                return handler.redirectTo(dashboard)
            } else {
                return handler.next();
            }
        }

        if (handler.isPointingTo(home)) {
            return handler.redirectTo(dashboard)
        }

        return handler.next();
    }
}
