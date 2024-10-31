import {FC} from "react";

interface messageTimestampProps {
    unixTimestamp:number
}

export const MessageTimestamp: FC<messageTimestampProps>= ({unixTimestamp})=> {
    const date = new Date(unixTimestamp)
    return <span className='message-date'>
        <br/>
        Message sent at: 10:{date.getMinutes()} am
    </span>
}
