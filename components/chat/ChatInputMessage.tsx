import React from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { CornerDownLeft } from 'lucide-react'
import { Label } from '../ui/label'

type Props = {
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean
}

export function ChatInputMessage({ text: input, onChange, onSubmit, disabled }: Props) {
  const hiddenDivRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    const div = hiddenDivRef.current
    const textArea = textareaRef.current

    if (div && textArea) {
      div.innerText = input
      textareaRef.current.style.height = `${div.offsetHeight}px`
    }
  }, [input])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === 'Enter') {
      onChange(input + '\n')
    } else if (event.key === 'Tab') {
      event.preventDefault()
      onChange(input + '\t')
    } else if (event.key === 'Enter' && input.trim().length > 0) {
      event.preventDefault()
      onSubmit()
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      className='overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring flex items-end'
      onSubmit={handleSubmit}
    >
      <div ref={hiddenDivRef} className='hidden' />
      <Label htmlFor='message' className='sr-only'>
        Message
      </Label>
      <Textarea
        id='message'
        ref={textareaRef}
        value={input}
        onChange={event => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        autoFocus
        spellCheck
        autoComplete='on'
        placeholder='Type your message here...'
        className='resize-none border-0 p-3 shadow-none focus-visible:ring-0'
        disabled={disabled}
      />
      <Button type='submit' disabled={input.trim().length === 0} size='sm' className='ml-auto gap-1.5'>
        Send
        <CornerDownLeft className='size-3.5' />
      </Button>
    </form>
  )
}
