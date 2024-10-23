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

    return<div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
        <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
            <div className='relative flex items-center space-x-4'>
                <div className='relative'>
                    <div className='relative w-8 sm:w-12 sm:h-12'>
                        <Image src={partner.image} fill alt='partner name' referrerPolicy='no-referrer'/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}


export default Page;
