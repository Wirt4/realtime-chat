import {FC} from "react";

interface ChatProps {
    params:{
        chatId: string;
    }
}

const Page: FC<ChatProps> = ({params}) => {
    return <div>foo</div>
}

export default Page;
