import Markdown from 'react-markdown'

export function BotBubbleMessage({ text }: { text: string }) {
  return (
    <div className='flex'>
      <div className='bg-card text-card-foreground rounded-lg rounded-bl-none px-4 py-3 max-w-[90%]'>
        <Markdown>{text}</Markdown>
      </div>
    </div>
  )
}
