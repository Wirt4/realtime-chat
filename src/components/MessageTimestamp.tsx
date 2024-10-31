import {FC, useEffect, useState} from "react";

interface messageTimestampProps {
    unixTimestamp:number
}

export const MessageTimestamp: FC<messageTimestampProps>= ({unixTimestamp})=> {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        const date = new DateWrapper(unixTimestamp);
        setFormattedDate(
            `Sent ${date.month}/${date.date}/${date.year}, ${date.hour}:${date.minutes} ${date.timeOfDay}`
        );
    }, [unixTimestamp]);

    if (!formattedDate) return null; // or a placeholder if needed

    return <span className="message-date">{formattedDate}</span>;

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

