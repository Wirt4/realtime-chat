import {FC} from "react";
import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import FriendRequests from "@/components/FriendRequests/FriendRequests";
import getFriendRequests from "@/app/(dashboard)/dashboard/requests/getFriendRequests";

const Page: FC = async () =>{
    const session = await myGetServerSession();

    if(!session) {
        notFound();
        return null;
    }

    const sessionId = session.user.id
    const requests = await getFriendRequests(sessionId);
    const title = 'Friend Requests'

    return (
        <>
            <title>{title}</title>
            <main className='pt-8'>
            <h1>{title}</h1>
            <div className='friend-requests-wrapper'>
                <FriendRequests incomingFriendRequests={requests} sessionId={sessionId}/>
            </div>
            </main>
        </>
    )
}

export default Page;
