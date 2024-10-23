import {FC} from "react";
import {notFound} from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import Image from "next/image";
import {db} from "@/lib/db";

interface ChatProps{
    params: {
        chatId:string;
    }
}

const Page: FC<ChatProps> = async ({params}) => {
    const session = await myGetServerSession();
    const participants = params.chatId.split('--')
    if (!session || !participants.includes(session.user.id)){
        notFound();
        return
    }
    const partnerId = session.user.id === 'kirk' ? 'spock' : 'kirk'
    const partner = (await db.get(`user:${partnerId}`)) as User

    return<div className='chat-a'>
        <div className='chat-b'>
            <div className='chat-c'>
                <div className='relative'>
                    <div className='chat-image'>
                        <Image src={partner.image} fill alt='fooey' referrerPolicy='no-referrer'/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}


export default Page;
