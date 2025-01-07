"use client"

import React, {FC, useRef, useState} from "react";
import TextareaAutosize from 'react-textarea-autosize';
import Helpers from "@/components/ChatInput/helpers";
import Button from "@/components/ui/button/Button";

interface ChatInputProps {
    chatPartner: User,
    chatId: string,
}

const ChatInput:FC<ChatInputProps> = ({chatPartner, chatId})=>{
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement| null>(null)
    const setterParams = {setIsLoading, setInput, reference: textAreaRef}
    const helpers = new Helpers(setterParams, chatId)

    return (
        <div aria-label='chat input' className='chat-input-a'>
            <div className='chat-input-b'>
                <TextareaAutosize ref={textAreaRef}
                                  aria-label='autosize field'
                                  placeholder={`Send ${chatPartner.name} a message`}
                                  onKeyDown={(event) => helpers.HandleKeystroke(event, input)}
                                  onChange={event => setInput(event.target.value)}
                                  value={input}
                                  rows={1}
                                  className='chat-input-c'
                />

                <div className="py-2"
                     aria-hidden="true"
                     onClick={() => helpers.setFocus()}
                >
                    <div className="py-px">
                        <div className="h-9"/>
                    </div>
                </div>
            </div>

            <div className="chat-input-d">
                <div className="flex-shrink-0">
                    <Button onClick={()=> helpers.SendMessage(input)}
                    isLoading={isLoading}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default  ChatInput
