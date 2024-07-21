import React, { ChangeEvent, useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { CornerDownLeft, Mic, Paperclip } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { Label } from '../ui/label'

type Props = {
  onSend: (message: string) => void;
}

export function ChatInputMessage({ onSend }: Props) {
  const [message, setMessage] = useState<string>('')

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend(message)
      setMessage('')
    }
  }

  return (
    <form
      className='relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring'
      onSubmit={(e) => {
        e.preventDefault()
        onSend(message)
        setMessage('')
      }}
    >
      <Label htmlFor='message' className='sr-only'>
        Message
      </Label>
      <Textarea
        id='message'
        value={message}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        rows={1}
        autoFocus
        spellCheck
        autoComplete='on'
        placeholder='Type your message here...'
        className='min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0'
      />
      <div className='flex items-center p-3 pt-0'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Paperclip className='size-4' />
              <span className='sr-only'>Attach file</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>Attach File</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Mic className='size-4' />
              <span className='sr-only'>Use Microphone</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>Use Microphone</TooltipContent>
        </Tooltip>
        <Button type='submit' size='sm' className='ml-auto gap-1.5'>
          Send Message
          <CornerDownLeft className='size-3.5' />
        </Button>
      </div>
    </form>
  )
}
