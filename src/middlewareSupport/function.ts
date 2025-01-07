import {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";
import {Handler} from "@/middlewareSupport/handler";

export const middleware = async (req: NextRequest)=>{
    const JWT = await getToken({req});
    const handler = new Handler(req, JWT);

    if (handler.isAccessingSensitiveRoute() && !handler.isAuthenticated()){
        return handler.redirectToLogin();
    }

    if (handler.isLogin()){
        if (handler.isAuthenticated()){
            return handler.redirectToDashboard()
        }
        return handler.next();
    }

    if (handler.isPointingToHome()){
        return handler.redirectToDashboard();
    }
}