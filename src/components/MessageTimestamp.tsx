import {FC} from "react";

interface messageTimestampProps {
    unixTimestamp:number
}

export const MessageTimestamp: FC<messageTimestampProps>= ({unixTimestamp})=> {
    return <span aria-label='timestamp'  className='message-date'><br/>Message sent at: {unixTimestamp}</span>
}
