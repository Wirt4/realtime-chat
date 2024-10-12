import { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module 'next-auth/jwt' {
    interface JWT {
        id: string
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
