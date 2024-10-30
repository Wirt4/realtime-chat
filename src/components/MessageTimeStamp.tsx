import {FC} from "react";

interface messageTimeStampProps {
    unixTimestamp:number
}

export const MessageTimeStamp: FC<messageTimeStampProps>= ({unixTimestamp})=> {
    return <span className='message-date'><br/>{unixTimestamp}</span>
}
