import {FC} from "react";
import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import FriendRequests from "@/components/FriendRequests";
import getFriendRequests from "@/app/(dashboard)/dashboard/requests/getFriendRequests";

const Page: FC = async () =>{
    const session = await myGetServerSession();

    if(!session) {
        notFound();
        return null;
    }

    const requests = await getFriendRequests(session.user.id);

    return <main className='pt-8'>
        <h1>
            Friend Requests
        </h1>
        <div className='friend-requests'>
        <FriendRequests incomingFriendRequests={[{senderEmail:'stub@stub.com', senderId:'1'}]}/>
        </div>
    </main>
}

export default Page;
