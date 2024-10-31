import {FC, useEffect, useState} from "react";

interface messageTimestampProps {
    unixTimestamp:number
}

export const MessageTimestamp: FC<messageTimestampProps>= ({unixTimestamp})=> {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        const date = new DateWrapper(unixTimestamp);
        setFormattedDate(
            date.format
        );
    }, [unixTimestamp]);

    if (!formattedDate) return null;

    return <span className="message-date">{formattedDate}</span>;

}

class DateWrapper{
    private _date: Date
    private TWELVE = 12

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
        const adjusted = this._date.getHours() % this.TWELVE
        return adjusted == 0 ? this.TWELVE : adjusted
    }

    get hour(){
        return this.formatHour()
    }

    get year(){
        return this._date.getFullYear()
    }

    get timeOfDay(){
        return this._date.getHours() < this.TWELVE ? 'am' : 'pm'
    }

    get minutes(){
        return this._date.getMinutes().toString().padStart(2,'0')
    }

    get format(){
        return  `Sent ${this.month}/${this.date}/${this.year}, ${this.hour}:${this.minutes} ${this.timeOfDay}`
    }
}

