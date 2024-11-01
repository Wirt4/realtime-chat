import {FC} from "react";
import Image from "next/image";

interface userStatus{
    hasNextMessage?: boolean;
    currentUser?: boolean
}

interface MessageThumbnailProps {
   userStatus?: userStatus;
}

const styling = (userStatus: userStatus| undefined) => {
    if (userStatus){
        return `order-${userStatus.currentUser? 1 : 2} ${userStatus.hasNextMessage? 'invisible': null}`
    }
    return ''
}

const MessageThumbnail: FC<MessageThumbnailProps> = ({userStatus}) => {
    return (<div
        aria-label="user thumbnail"
        className={styling(userStatus)}>
            <Image src='/stub' fill alt='foo'/>
        </div>)
};

export default MessageThumbnail;
