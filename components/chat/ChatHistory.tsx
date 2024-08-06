import React from 'react'
import { Message } from 'ai'
import { BotBubbleMessage, HummanBubbleMessage } from '../chat-bubbles'
import { TypingLoader } from '../loaders'

type Props = {
  messages: Message[]
  isLoading?: boolean;
}

const ChatHistory = React.forwardRef<HTMLDivElement, Props>(
  ({ messages, isLoading }, ref) => {
    return (
      <div
        ref={ref}
        className='flex-1 overflow-y-auto h-full p-4 bg-muted/10'
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
)

ChatHistory.displayName = 'ChatHistory'
export { ChatHistory }
