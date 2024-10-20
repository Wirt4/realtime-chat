import {FC} from "react";
import {notFound} from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";

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

    return <div/>
}


export default Page;
