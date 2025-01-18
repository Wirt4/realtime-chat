import { Session } from "next-auth";
export interface iSessionData {
    getSession(): Promise<Session>
}