import {FC} from "react";

interface messageTimestampProps {
    unixTimestamp:number
}

export const MessageTimestamp: FC<messageTimestampProps>= ({unixTimestamp})=> {
    return <span className='message-date'>
        <br/>
        Message sent at: {unixTimestamp}
    </span>
}
