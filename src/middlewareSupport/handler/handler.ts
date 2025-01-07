import { JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { NextResponseWrapper } from "@/lib/nextResponseWrapper";
import { IHandler } from "@/middlewareSupport/handler/interface"

export class Handler implements IHandler {
    private _jwt: JWT | null = null;
    private _targetPath: string = "";
    private _url: string = "";

    isAuthenticated(): boolean {
        return !!this._jwt;
    }

    setRequest(request: NextRequest): void {
        console.log('set request called')
        this._targetPath = request.nextUrl.pathname;
        this._url = request.url;
    }

    setJWT(jwt: JWT | null): void {
        this._jwt = jwt
    }

    isLogin(): boolean {
        return this._targetPath.startsWith('/login');
    }

    next() {
        return NextResponseWrapper.next()
    }

    redirectToDashboard() {
        return this.redirect('/dashboard');
    }

    redirectToLogin() {
        return this.redirect('/login');
    }

    isAccessingSensitiveRoute() {
        return this._targetPath.startsWith('/dashboard');
    }

    isPointingToHome() {
        console.log('isPointingToHome', this._targetPath)
        return this._targetPath === '/';
    }

    private redirect(endpoint: string) {
        return NextResponseWrapper.redirect(new URL(endpoint, this._url));
    }
}
