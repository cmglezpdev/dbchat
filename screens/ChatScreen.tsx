'use client'
import React, { useState, useRef, useEffect } from 'react'
import { InputMessage } from '@/components/chat'
import { BotBubbleMessage, HummanBubbleMessage } from '@/components/chat-bubbles'

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }])
  }

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText, 'user')
      setInputText('')
      // Aquí puedes agregar la lógica para enviar el mensaje al backend
      // y luego agregar la respuesta del AI
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className='flex flex-col justify-between h-screen max-h-screen'>
      <div
        ref={chatContainerRef}
        className='flex-1 overflow-y-scroll max-h-[calc(100vh - 250px)] p-4 space-y-4'
      >
        {messages.map(message => (
          message.sender === 'ai'
            ? (<BotBubbleMessage key={message.id} text={message.text} />)
            : (<HummanBubbleMessage key={message.id} text={message.text} />)
        ))}
      </div>
      <div className='p-4 border-t'>
        <InputMessage
          text={inputText}
          setText={setInputText}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  )
}
