import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

type Props = {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
}

export function InputMessage({ text, setText, onSend }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)
  const [textareaHeight, setTextareaHeight] = useState(40)

  useEffect(() => {
    const textarea = textareaRef.current!
    const mirror = mirrorRef.current!

    if (textarea && mirror) {
      mirror.textContent = text + '\n'
      const newHeight = Math.min(200, Math.max(40, mirror.offsetHeight))
      setTextareaHeight(newHeight)
    }
  }, [text])

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <section className='w-full flex gap-3 p-5 rounded-full bg-red-200'>
      <div className='relative w-full' style={{ height: `${textareaHeight}px` }}>
        <div
          ref={mirrorRef}
          className='invisible whitespace-pre-wrap break-words overflow-hidden w-full absolute bottom-0'
        />
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          rows={1}
          autoFocus
          spellCheck
          autoComplete='on'
          className='absolute bottom-0 left-0 w-full resize-none overflow-hidden border rounded-md p-2 min-h-[40px] max-h-[200px] text-base leading-tight'
          style={{ height: `${textareaHeight}px` }}
          placeholder='Escribe aquí...'
        />
      </div>
      <div className='flex items-end'>
        <Button className='px-5' onClick={onSend}>
          <Send />
        </Button>
      </div>
    </section>
  )
}
