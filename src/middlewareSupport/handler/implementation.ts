import { NextRequest, NextResponse } from "next/server";
import { NextResponseWrapper } from "@/lib/nextResponseWrapper";
import { IRouteHandler } from "@/middlewareSupport/handler/interface"

export class RouteHandler implements IRouteHandler {
    private _targetPath: string;
    private _url: string;
    private _protectedRoute: string

    constructor(request: NextRequest, protectedRoute: string) {
        this._targetPath = request.nextUrl.pathname;
        this._url = request.url;
        this._protectedRoute = protectedRoute
    }
    redirectTo(endpoint: string): NextResponse<unknown> {
        return NextResponseWrapper.redirect(new URL(endpoint, this._url));
    }

    isPointingTo(endpoint: string): boolean {
        return this._targetPath === endpoint
    }

    next() {
        return NextResponseWrapper.next()
    }


    isAccessingProtectedroute() {
        return this._targetPath.startsWith(this._protectedRoute);
    }
}
