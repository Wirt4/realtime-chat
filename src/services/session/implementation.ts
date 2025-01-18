import { iSessionData } from "./interface";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
export class SessionData implements iSessionData {
    async getSession(): Promise<Session> {
        const session = await getServerSession(authOptions);
        if (session) {
            return session;
        }
        throw new Error('session returned null');
    }
}