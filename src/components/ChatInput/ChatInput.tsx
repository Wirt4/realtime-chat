"use client"

import React, {FC, useRef, useState} from "react";
import TextareaAutosize from 'react-textarea-autosize';
import {sendMessage} from "@/components/ChatInput/helpers";

interface ChatInputProps {}


const ChatInput:FC<ChatInputProps> = ({})=>{
    const [input, setInput] = useState("");
    //use reference to the DOM text area element, default to null
    const textAreaRef = useRef<HTMLTextAreaElement| null>(null)

    return (<div>
        <div>
            <TextareaAutosize ref={textAreaRef}
                              aria-label='autosize field'
                              onKeyDown={(event) => sendMessage(event)}
                              value={input}
                              onChange={event => setInput(event.target.value)}
                              placeholder='Message Batman'
            />
        </div>
    </div>)
}

export default  ChatInput
