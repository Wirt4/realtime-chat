import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aSessionData } from "./abstract";

export class SessionData extends aSessionData {
    async getSession(): Promise<Session> {
        const session = await getServerSession(authOptions);
        if (session) {
            return session;
        }
        throw new Error('session returned null');
    }
}
