import {FC} from "react";

interface messageTimestampProps {
    unixTimestamp:number
}

export const MessageTimestamp: FC<messageTimestampProps>= ({unixTimestamp})=> {
    const date = new Date(unixTimestamp)
    const mm = date.getMonth() + 1
    const yyyy = date.getFullYear()
    const dd = date.getDate()
    const hh = adjustHour(date.getHours())
    return <span className='message-date'>
        <br/>
        Sent {mm}/{dd}/{yyyy}, {hh}:{date.getMinutes()} {date.getHours() < 12 ? 'am' : 'pm'}
    </span>
}

const adjustHour=(hour:number)=>{
    if (hour == 0){
        return 12
    }

    if (hour > 12){
        return hour -12
    }

    return hour
}
