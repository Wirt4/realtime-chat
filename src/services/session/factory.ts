import { iSessionData } from "./interface"
import { SessionData } from "./implementation"
export function sessionDataFactory(): iSessionData {
    return new SessionData();
}