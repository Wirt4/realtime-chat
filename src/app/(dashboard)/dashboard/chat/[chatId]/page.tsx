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
    const userId = session?.user?.id
    const participants = params.chatId.split('--')

    if (!(session && participants.includes(userId as string))){
        notFound();
    }

    const partnerId = userId === participants[0] ? participants[1] : participants[0]
    const partner = (await db.get(`user:${partnerId}`)) as User
    return<Display partner={partner}/>
}

interface DisplayProps {
    partner: User
}

const Display: FC<DisplayProps> = ({partner}) =>{
    return<div className='chat-a'>
        <div className='chat-b'>
            <div className='chat-c'>
                <div className='relative'>
                    <div className='chat-d'>
                        <Image src={partner.image}
                               fill
                               alt={partner.name}
                               referrerPolicy='no-referrer'
                               className='chat-image'/>
                    </div>
                </div>
                <div className='chat-e'>
                    <div className='chat-f'>
                        <span className='chat-g'>
                            {partner.name}
                        </span>
                    </div>
                    <span className='chat-h'>
                        {partner.email}
                    </span>
                </div>
            </div>
        </div>
        <div aria-label='messages'/>
    </div>
}

export default Page;
