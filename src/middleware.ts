import {withAuth} from "next-auth/middleware";
import {Middleware} from "@/middlewareSupport/functionality";

const middleware = new Middleware()

export const config = {
    matchers:  ['login', '/', '/dashboard/:path*']
}

export default withAuth(
    middleware.processRequest,
    {
    callbacks:{
        async authorized(){
            return true;
        }
    }}
);
