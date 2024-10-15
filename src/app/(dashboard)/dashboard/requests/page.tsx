import {FC} from "react";
import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import FriendRequests from "@/components/FriendRequests";

const Page: FC = async () =>{
    const session = await myGetServerSession()
    if(!session) notFound()
    return <FriendRequests/>
}

export default Page;
