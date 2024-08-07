import React from 'react'
import { Textarea } from '../ui/textarea'
import { ArrowRight } from 'lucide-react'
import { Label } from '../ui/label'
import { useLang } from '@/store'

type Props = {
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean
}

const ChatInputMessage = React.forwardRef<HTMLFormElement, Props>(
  ({ text: input, onChange, onSubmit, disabled }, ref) => {
    const { data } = useLang(({ data }) => ({ data }))
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useEffect(() => {
      const textArea = textareaRef.current

      if (textArea) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }, [input])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.ctrlKey || event.shiftKey) && event.key === 'Enter') {
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
        className='overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring flex gap-2 items-end'
        ref={ref}
        onSubmit={handleSubmit}
      >
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
          placeholder={data.chatScreen.input.placeholder}
          className='min-h-[70px] max-h-[300px] resize-none overflow-hidden bottom-0 outline-none border-none'
          disabled={disabled}
        />
        <button
          type='submit'
          disabled={input.trim().length === 0}
          className='ml-auto gap-1.5 p-4 bg-primary text-primary-foreground rounded-full mr-2 mb-2'
        >
          <ArrowRight className='size-3.5' />
        </button>
      </form>
    )
  }
)

ChatInputMessage.displayName = 'ChatInputMessage'
export { ChatInputMessage }
