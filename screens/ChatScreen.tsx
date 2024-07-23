'use client'
import { ChatHistory, ChatInputMessage, ChatSettings } from '@/components/chat'
import { useChat } from 'ai/react'

export function ChatScreen() {
  const { messages, isLoading, input, handleSubmit, handleInputChange } = useChat({
    keepLastMessageOnError: true
  })

  return (
    <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-3 lg:grid-cols-4'>
      {/* Chat Settings */}
      <div className='relative hidden flex-col items-start gap-8 md:flex'>
        <ChatSettings />
      </div>

      <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 md:col-span-2 lg:col-span-3'>
        {/* Chat History */}
        <ChatHistory
          messages={messages}
          isLoading={isLoading}
        />

        {/* Box Input Messages */}
        <ChatInputMessage
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}
