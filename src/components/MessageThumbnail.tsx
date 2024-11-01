import {FC} from "react";
import Image from "next/image";

interface userStatus{
    hasNextMessage: boolean
    currentUser: boolean
}

interface userInfo{
    image:string
    userName:string
}

interface MessageThumbnailProps {
    userStatus: userStatus
    userInfo: userInfo
}

const styling = (userStatus: userStatus| undefined) => {
    if (userStatus){
        return `order-${userStatus.currentUser? 1 : 2} ${userStatus.hasNextMessage? 'invisible': null}`
    }
    return ''
}

const MessageThumbnail: FC<MessageThumbnailProps> = ({userStatus, userInfo}) => {
    return (<div
        aria-label="user thumbnail"
        className={styling(userStatus)}>
            <Image src={userInfo?.image as string}
                   fill
                   alt={userInfo?.userName as string}/>
        </div>)
};

export default MessageThumbnail;
