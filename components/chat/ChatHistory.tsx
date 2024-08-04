import { useEffect, useRef } from 'react'
import { Message } from 'ai'
import { BotBubbleMessage, HummanBubbleMessage } from '../chat-bubbles'
import { TypingLoader } from '../loaders'

type Props = {
  messages: Message[]
  isLoading?: boolean;
}

export function ChatHistory({ messages, isLoading }: Props) {
  const chatHistoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const divHistory = chatHistoryRef.current
    if (divHistory) {
      divHistory.scrollTop = divHistory.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={chatHistoryRef}
      className='flex-1 max-h-[500px] overflow-y-auto p-4 bg-muted/10'
    >
      <div className='grid gap-4'>
        {messages.map(message => (
          message.role === 'user'
            ? (<HummanBubbleMessage key={message.id} text={message.content} />)
            : (<BotBubbleMessage key={message.id} text={message.content} />)
        ))}
      </div>

      {isLoading && (
        <div className='col-start-1 col-end-12 fade-in'>
          <TypingLoader />
        </div>
      )}
    </div>
  )
}
