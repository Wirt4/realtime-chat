import {NextRequest, NextResponse} from "next/server";
import {getToken, JWT} from "next-auth/jwt";
import {withAuth} from "next-auth/middleware";

export const config = {
    matchers:  ['login', '/', '/dashboard/:path*']
}

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

class Handler {
    _jwt: JWT | null;
    _targetPath: string;
    _url: string;

    constructor(request: NextRequest, jwt: JWT | null) {
        this._targetPath = request.nextUrl.pathname;
        this._url = request.url;
        this._jwt = jwt;
    }

    isAuthenticated(): boolean{
        return !! this._jwt;
    }

    isLogin(): boolean{
        return this._targetPath.startsWith('/login');
    }

    next(){
        return NextResponse.next()
    }

    redirectToDashboard(){
        return this.redirect('/dashboard');
    }

    redirectToLogin(){
        return this.redirect('/login');
    }

    redirect(endpoint: string){
        return NextResponse.redirect(new URL(endpoint, this._url));
    }

    isAccessingSensitiveRoute(){
        return this._targetPath.startsWith('/dashboard');
    }

    isPointingToHome(){
        return this._targetPath === '/';
    }
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
