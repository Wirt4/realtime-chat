import { NextRequest } from "next/server";

export interface IAuthenticator {
    isValid(): boolean;
    fetchJWT(request: NextRequest): Promise<void>
}