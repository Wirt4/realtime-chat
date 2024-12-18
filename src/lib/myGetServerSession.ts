import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

const myGetServerSession = async ()=>{
    return getServerSession(authOptions as any)
}

export default myGetServerSession;
