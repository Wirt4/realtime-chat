import React from "react";

export const sendMessage = (event: React.KeyboardEvent<HTMLTextAreaElement>)=>{
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
    }
}
