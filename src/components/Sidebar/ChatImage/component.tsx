import Image from "next/image";
import { FC } from "react";
import { ChatImageProps } from "./interface";
import { notFound } from "next/navigation";

const ChatImage: FC<ChatImageProps> = (props) => {
    const { participantInfo, chatId, sessionId } = props;
    const imgaeSize = 32;
    let src: string = '';

    if (participantInfo[0].id === sessionId) {
        src = participantInfo[1].image
    } else if (participantInfo[1].id === sessionId) {
        src = participantInfo[0].image
    } else {
        notFound();
    }

    return (<Image src={src}
        alt={chatId}
        referrerPolicy='no-referrer'
        width={imgaeSize}
        height={imgaeSize}
        className='rounded-full'
    />)
}

export default ChatImage
