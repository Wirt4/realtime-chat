import { IAuthenticator } from "@/services/middleware/authenticator/interface";
import { Authenticator } from "@/services/middleware/authenticator/implementation";

export function authenticatorFactory(): IAuthenticator {
    return new Authenticator()
}
