import { NextRequest } from "next/server";
import { IAuthenticator } from "@/middlewareSupport/authenticator/interface";
import { getToken, JWT } from "next-auth/jwt";

export class Authenticator implements IAuthenticator {
    private token: JWT | null = null


    async fetchJWT(request: NextRequest): Promise<void> {
        this.token = await getToken({ req: request })
    }

    isValid(): boolean {
        if (!this.token) {
            return false;
        }
        return true;
    };
}
