import { ChatMessage } from '@/types'
import { BotBubbleMessage, HummanBubbleMessage } from '../chat-bubbles'
import { TypingLoader } from '../loaders'

type Props = {
  chats: ChatMessage[]
  isLoading?: boolean;
}

export function ChatHistory({ chats, isLoading }: Props) {
  return (
    <div className='flex flex-col h-full overflow-x-auto mb-4 overflow-scroll'>
      <div className='grid grid-cols-12 gap-y-2'>
        <BotBubbleMessage text='Hola, puedes escribir tu text en español y yo te ayudo con la ortografía.' />
        {chats.map((message, index) => (
          message.role === 'system'
            ? (<BotBubbleMessage key={index} text={message.content} />)
            : (<HummanBubbleMessage key={index} text={message.content} />)
        ))}

        {isLoading && (
          <div className='col-start-1 col-end-12 fade-in'>
            <TypingLoader />
          </div>
        )}
      </div>
    </div>
  )
}
