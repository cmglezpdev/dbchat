'use client'
import React, { useState } from 'react'
import { ChatHistory, ChatInputMessage, ChatSettings } from '@/components/chat'
import { ChatMessage } from '@/types'

const chatMessage: ChatMessage[] = [
  {
    id: 1,
    content: 'Hola, ¿cómo estás?',
    role: 'user'
  },
  {
    id: 2,
    content: 'Hola! Estoy bien, gracias. ¿En qué puedo ayudarte hoy?',
    role: 'system'
  },
  {
    id: 3,
    content: 'Quisiera saber más sobre la inteligencia artificial.',
    role: 'user'
  },
  {
    id: 4,
    content: 'Claro, la inteligencia artificial es un campo de la informática que se centra en la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. ¿Te gustaría saber algo específico?',
    role: 'system'
  },
  {
    id: 5,
    content: 'Sí, ¿cómo funcionan los modelos de lenguaje como tú?',
    role: 'user'
  },
  {
    id: 6,
    content: 'Los modelos de lenguaje como yo funcionan utilizando redes neuronales profundas, específicamente un tipo de arquitectura llamada Transformer. Estos modelos son entrenados con grandes cantidades de texto para aprender patrones en el lenguaje y generar respuestas coherentes. ¿Quieres más detalles sobre algún aspecto en particular?',
    role: 'system'
  }
]

export function ChatScreen() {
  const [history, setHistory] = useState<ChatMessage[]>(chatMessage)

  const handleSendMessage = (message: string) => {
    setHistory(h => [...h, {
      id: 23,
      role: 'user',
      content: message
    }])
  }

  return (
    <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-3 lg:grid-cols-4'>
      {/* Chat Settings */}
      <ChatSettings />

      <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 md:col-span-2 lg:col-span-3'>
        {/* Chat History */}
        <ChatHistory
          chats={history}
          isLoading={false}
        />

        {/* Box Input Messages */}
        <ChatInputMessage
          onSend={handleSendMessage}
        />
      </div>
    </main>
  )
}
