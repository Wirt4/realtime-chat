import {JWT} from "next-auth/jwt";
import {NextRequest} from "next/server";
import {NextResponseWrapper} from "@/lib/nextResponseWrapper";

export class Handler {
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
        return NextResponseWrapper.next()
    }

    redirectToDashboard(){
        return this.redirect('/dashboard');
    }

    redirectToLogin(){
        return this.redirect('/login');
    }

    redirect(endpoint: string){
        return NextResponseWrapper.redirect(new URL(endpoint, this._url));
    }

    isAccessingSensitiveRoute(){
        return this._targetPath.startsWith('/dashboard');
    }

    isPointingToHome(){
        return this._targetPath === '/';
    }
}