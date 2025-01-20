import { aSessionData } from "./abstract";
import { SessionData } from "./implementation";

export function sessionDataFactory(): aSessionData {
    return new SessionData();
}
