import {FC} from "react";

interface messageTimestampProps {
    unixTimestamp:number
}

export const MessageTimestamp: FC<messageTimestampProps>= ({unixTimestamp})=> {
    const date = new DateWrapper(unixTimestamp)
    return <span className='message-date'>
        <br/>
        Sent {date.month}/{date.date}/{date.year}, {date.hour}:{date.minutes} {date.timeOfDay}
    </span>
}

class DateWrapper{
    private _date: Date

    constructor(timestamp: number){
        this._date = new Date(timestamp);
    }

    get month(){
        return this._date.getMonth() + 1
    }

    get date(){
        return this._date.getDate()
    }

    formatHour(){
        const twelve = 12
        const adjusted = this._date.getHours() % twelve
        return adjusted == 0 ? twelve : adjusted
    }

    get hour(){
        return this.formatHour()
    }

    get year(){
        return this._date.getFullYear()
    }

    get timeOfDay(){
        return this._date.getHours() < 12 ? 'am' : 'pm'
    }

    get minutes(){
        return this._date.getMinutes()
    }
}

