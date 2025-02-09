import { NextResponse } from "next/server";

export interface IRouteHandler {
    isAccessingProtectedroute(): boolean
    redirectTo(endpoint: string): NextResponse<unknown>
    isPointingTo(endpoint: string): boolean
    next(): NextResponse<unknown>
}
