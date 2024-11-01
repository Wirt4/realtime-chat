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
    const styles = 'relative h-6 w-6'
    if (userStatus){
        return `${styles} order-${userStatus.currentUser? 1 : 2} ${userStatus.hasNextMessage? 'invisible': null}`
    }
    return styles
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
