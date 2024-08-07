'use client'

import { Message } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { ChatHistory, ChatInputMessage, ChatDbDesigns } from '@/components/chat'
import { useConfigStore, useDesignStore, useLang } from '@/store'
import { useToast } from '@/components/ui/use-toast'

export function ChatScreen() {
  const { data, lang } = useLang(({ data, lang }) => ({ data, lang }))
  const { jsonDesign, setJsonDesign, setSqlDesign, sqlDesign } = useDesignStore()
  const config = useConfigStore((store) => ({
    model: store.model,
    apiKey: store.apiKey,
    database: store.database,
    styles: store.styles
  }))
  const { toast } = useToast()
  const [isLoading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')

  const designSectionRef = useRef<HTMLDivElement>(null)
  const chatSectionRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLFormElement>(null)
  const chatHistoryRef = useRef<HTMLDivElement>(null)

  // Set welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const firstMessage: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: data.chatScreen.firstMessage
      }
      setMessages([firstMessage])
    } else {
      const [firstMessage, ...restOfMessages] = messages
      if (firstMessage.content === data.chatScreen.firstMessage) return
      setMessages([{
        ...firstMessage,
        content: data.chatScreen.firstMessage
      }, ...restOfMessages])
    }
  }, [messages.length, setMessages, messages, data.chatScreen.firstMessage])

  // Update ui height
  useEffect(() => {
    const adjustHeight = () => {
      if (chatSectionRef.current && chatInputRef.current && chatHistoryRef.current && designSectionRef.current) {
        const availableHeight = window.innerHeight
        const chatSectionRect = chatSectionRef.current.getBoundingClientRect()
        const maxChatSectionHeight = availableHeight - chatSectionRect.top - 16
        const inputHeight = chatInputRef.current.offsetHeight

        chatSectionRef.current.style.height = `${maxChatSectionHeight}px`
        chatSectionRef.current.style.maxHeight = `${maxChatSectionHeight}px`

        designSectionRef.current.style.height = `${maxChatSectionHeight}px`
        designSectionRef.current.style.maxHeight = `${maxChatSectionHeight}px`

        const historyHeight = maxChatSectionHeight - inputHeight
        chatHistoryRef.current.style.height = `${historyHeight}px`
      }
    }

    adjustHeight()

    const resizeObserver = new ResizeObserver(adjustHeight)
    if (chatInputRef.current) {
      resizeObserver.observe(chatInputRef.current)
    }
    window.addEventListener('resize', adjustHeight)

    return () => {
      if (chatInputRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(chatInputRef.current)
      }
      window.removeEventListener('resize', adjustHeight)
    }
  }, [])

  // scroll in the history
  useEffect(() => {
    const divHistory = chatHistoryRef.current
    if (divHistory) {
      divHistory.scrollTop = divHistory.scrollHeight
    }
  }, [messages])

  const handleInputChange = (text: string) => {
    setInput(text)
  }

  const handleSubmit = async () => {
    console.debug('Send a new user question')
    setLoading(true)
    setInput('')
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    }

    setMessages(ms => [...ms, userMessage])

    console.debug('Calling api to generate response')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          jsonDesign,
          sqlDesign,
          config: {
            ...config,
            lang
          }
        })
      })

      if (!response.ok) {
        const { message } = await response.json()
        throw new Error(message)
      }

      const {
        jsonDesign: newJsonDesign,
        sqlDesign: newSqlDesign,
        message: systemMessage
      } = await response.json()

      // update elements
      setMessages(ms => [...ms, systemMessage])
      setJsonDesign(newJsonDesign)
      setSqlDesign(newSqlDesign)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
      console.error(error)
      setLoading(false)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='grid flex-1 gap-4 h-screen md:grid-cols-2 p-4'>
      {/* Chat Settings */}
      <div
        className='relative hidden flex-col items-start gap-8 md:flex'
        ref={designSectionRef}
      >
        <ChatDbDesigns
          jsonDesign={jsonDesign}
          sqlDesign={sqlDesign}
        />
      </div>

      <div
        className='relative flex flex-col gap-4 justify-between rounded-xl bg-muted/50 p-4'
        ref={chatSectionRef}
      >
        {/* Chat History */}
        <ChatHistory
          ref={chatHistoryRef}
          messages={messages}
          isLoading={isLoading}
        />

        {/* Box Input Messages */}
        <ChatInputMessage
          ref={chatInputRef}
          text={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={!config.apiKey || !config.model}
        />
      </div>
    </main>
  )
}
