import {FC} from "react";
import Image from "next/image";

interface MessageThumbnailProps {
    userStatus: userStatus
    userInfo: userInfo
}

interface userStatus{
    hasNextMessage: boolean
    currentUser: boolean
}

interface userInfo{
    image:string
    userName:string
}


const styling = (userStatus: userStatus| undefined) => {
    const styles = new Styles()
    if (userStatus){
        if (userStatus.currentUser){
            styles.add('order-1');
        }else{
            styles.add('order-2');
        }
        if (userStatus.hasNextMessage){
           styles.add('invisible')
        }
    }
    return styles.final
}

class Styles{
    styles:string[]

    constructor(){
        this.styles = ['relative h-6 w-6']
    }

    add(style: string){
        this.styles.push(style)
    }

    get final(): string{
        return this.styles.join(' ')
    }
}

const MessageThumbnail: FC<MessageThumbnailProps> = ({userStatus, userInfo}) => {
    return (<div
        aria-label="user thumbnail"
        className={styling(userStatus)}>
            <Image src={userInfo.image}
                   fill
                   alt={userInfo.userName}/>
        </div>)
};

export default MessageThumbnail;
