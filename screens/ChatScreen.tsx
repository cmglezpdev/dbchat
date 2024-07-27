'use client'
import { ChatHistory, ChatInputMessage, ChatSettings } from '@/components/chat'
import { useChat } from 'ai/react'

export function ChatScreen() {
  const { messages, isLoading, input, setInput, append } = useChat({
    keepLastMessageOnError: true
  })

  const handleInputChange = (text: string) => {
    setInput(text)
  }

  const handleSubmit = () => {
    append({
      role: 'user',
      content: input
    })
  }

  return (
    <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2'>
      {/* Chat Settings */}
      <div className='relative hidden flex-col items-start gap-8 md:flex'>
        <ChatSettings />
      </div>

      <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4'>
        {/* Chat History */}
        <ChatHistory
          messages={messages}
          isLoading={isLoading}
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
