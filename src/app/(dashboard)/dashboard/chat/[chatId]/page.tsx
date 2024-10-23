import {FC} from "react";
import {notFound} from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import Image from "next/image";

interface ChatProps{
    params: {
        chatId:string;
    }
}

const Page: FC<ChatProps> = async ({params}) => {
    const session = await myGetServerSession();
    if (!session || !params.chatId.split('--').includes(session.user.id)){
        notFound();
    }
    const imageSource ="https://media.wired.com/photos/5f87340d114b38fa1f8339f9/master/w_1600,c_limit/Ideas_Surprised_Pikachu_HD.jpg"

    return <div><Image src={imageSource} width="40" height="40" alt={'pikachu'}/></div>
}


export default Page;
