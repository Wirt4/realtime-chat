import { NextRequest } from "next/server";
import { IAuthenticator } from "@/middlewareSupport/authenticator/interface";
import { Authenticator } from "@/middlewareSupport/authenticator/implementation";

export function authenticatorFactory(): IAuthenticator {
    return new Authenticator()
}
