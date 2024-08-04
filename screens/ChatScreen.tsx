'use client'

import { useEffect, useState } from 'react'
import { Message } from 'ai/react'
import { ChatHistory, ChatInputMessage, ChatDbDesigns } from '@/components/chat'
import { useDesignStore } from '@/store'

export function ChatScreen() {
  const { jsonDesign, setJsonDesign, setSqlDesign, sqlDesign } = useDesignStore()
  const [isLoading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')

  useEffect(() => {
    if (messages.length === 0) {
      const firstMessage: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: 'Hola, cuéntame cuales son los requerimientos de tu aplicación y te ayudaré a modelar una base de datos para tí.'
      }
      setMessages([firstMessage])
    }
  }, [messages.length, setMessages])

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
          sqlDesign
        })
      })

      const {
        jsonDesign: newJsonDesign,
        sqlDesign: newSqlDesign,
        message: systemMessage
      } = await response.json()

      // update elements
      setMessages(ms => [...ms, systemMessage])
      setJsonDesign(newJsonDesign)
      setSqlDesign(newSqlDesign)
    } catch (error) {
      console.error('Error calling api', error)
      setLoading(false)
      return
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2'>
      {/* Chat Settings */}
      <div className='relative hidden flex-col items-start gap-8 md:flex'>
        <ChatDbDesigns
          jsonDesign={jsonDesign}
          sqlDesign={sqlDesign}
        />
      </div>

      <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4'>
        {/* Chat History */}
        <ChatHistory
          messages={messages}
          isLoading={isLoading}
        />

        {/* Box Input Messages */}
        <ChatInputMessage
          text={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  )
}

// Creame una forma de manejar el registro de usuarios en una pagina, que puedas controlar que el usuario se registra y los dispositivos (o sessiones) que tiene abiertas para poder restringir despues

// =========
// Quiero crear un systema de pagos para usuarios que use las pasarelas de pago stripe y paypal
