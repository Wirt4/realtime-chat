import {withAuth} from "next-auth/middleware";
import {middleware} from "@/middlewareSupport/function";

export const config = {
    matchers:  ['login', '/', '/dashboard/:path*']
}

export default withAuth(
    middleware,
    {
    callbacks:{
        async authorized(){
            return true;
        }
    }}
);
