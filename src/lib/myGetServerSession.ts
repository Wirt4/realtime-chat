import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

const  myGetServerSession= async ()=>{
    return getServerSession(authOptions)
}

export default myGetServerSession;
