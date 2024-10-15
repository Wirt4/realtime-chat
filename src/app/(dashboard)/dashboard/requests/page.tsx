import {FC} from "react";
import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import FriendRequests from "@/components/FriendRequests";
import getFriendRequests from "@/app/(dashboard)/dashboard/requests/getFriendRequests";

const Page: FC = async () =>{
    const session = await myGetServerSession()
    const requests = await getFriendRequests()
    if(!session) notFound()
    return <FriendRequests/>
}

export default Page;
