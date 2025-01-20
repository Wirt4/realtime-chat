import { Session } from "next-auth";
export abstract class aSessionData {
    abstract getSession(): Promise<Session>
}
