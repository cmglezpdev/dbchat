'use client'

import { useEffect, useState } from 'react'
import { useChat } from 'ai/react'
import { ChatHistory, ChatInputMessage, ChatSettings } from '@/components/chat'
import { DbDesign } from '@/lib/ai'

export function ChatScreen() {
  const [isLoading, setLoading] = useState(false)
  const [dbDesign, setDbDesign] = useState<object | null>(null)
  const { messages, isLoading: chatIsLoading, input, setInput, reload, setMessages } = useChat({
    keepLastMessageOnError: true
  })

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: crypto.randomUUID(),
        role: 'system',
        content: 'Hola, cuéntame cuales son los requerimientos de tu aplicación y te ayudaré a modelar una base de datos para tí.'
      }])
    }
  }, [messages.length, setMessages])

  const handleInputChange = (text: string) => {
    setInput(text)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setInput('')
    setMessages([...messages, { id: crypto.randomUUID(), role: 'user', content: input }])
    const response = await fetch('/api/object', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input })
    })

    // const dbDesignResponse: DbDesign = JSON.parse(await response.text())
    const { design }: DbDesign = await response.json()
    setDbDesign(design)
    await reload()
    setLoading(false)
  }

  return (
    <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2'>
      {/* Chat Settings */}
      <div className='relative hidden flex-col items-start gap-8 md:flex'>
        <ChatSettings
          dbDesign={dbDesign}
        />
      </div>

      <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4'>
        {/* Chat History */}
        <ChatHistory
          messages={messages}
          isLoading={isLoading || chatIsLoading}
        />

        {/* Box Input Messages */}
        <ChatInputMessage
          text={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}
