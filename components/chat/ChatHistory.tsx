import { ChatMessage } from '@/types'
import { BotBubbleMessage, HummanBubbleMessage } from '../chat-bubbles'
import { TypingLoader } from '../loaders'
import { useEffect, useRef } from 'react'

type Props = {
  chats: ChatMessage[]
  isLoading?: boolean;
}

export function ChatHistory({ chats, isLoading }: Props) {
  const chatHistoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const divHistory = chatHistoryRef.current
    if (divHistory) {
      divHistory.scrollTop = divHistory.scrollHeight
    }
  }, [chats])

  return (
    <div
      ref={chatHistoryRef}
      className='flex-1 max-h-[500px] overflow-y-scroll'
    >
      {chats.map(message => (
        message.role === 'system'
          ? (<BotBubbleMessage key={message.id} text={message.content} />)
          : (<HummanBubbleMessage key={message.id} text={message.content} />)
      ))}

      {isLoading && (
        <div className='col-start-1 col-end-12 fade-in'>
          <TypingLoader />
        </div>
      )}
    </div>
  )
}
