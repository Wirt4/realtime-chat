import {getServerSession} from "next-auth";
import {Auth} from "@/lib/auth";

const  myGetServerSession= async ()=>{
    return getServerSession(Auth.options())
}

export default myGetServerSession;