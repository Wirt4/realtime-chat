import { NextResponse, NextRequest } from "next/server";
import { JWT } from "next-auth/jwt"

export interface IHandler {
    isAccessingSensitiveRoute(): boolean
    isAuthenticated(): boolean
    redirectToLogin(): NextResponse<unknown>
    redirectToDashboard(): NextResponse<unknown>
    isLogin(): boolean
    next(): NextResponse<unknown>
    isPointingToHome(): boolean
    setRequest(request: NextRequest): void
    setJWT(jwt: JWT | null): void
}