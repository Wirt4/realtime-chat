import {FC} from "react";
import {notFound} from "next/navigation";

interface ChatProps {
    params:{
        chatId: string;
    }
}

const Page: FC<ChatProps> = async ({params}) => {
    notFound();
    return <div>foo</div>
}

export default Page;
