'use client'
import {
  CornerDownLeft,
  Mic,
  Paperclip
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ChatSideMenu } from '@/components/menu'
import { ChatHeader, ChatSettings } from '@/components/chat'
import { BotBubbleMessage, HummanBubbleMessage } from '@/components/chat-bubbles'

// generate 10 chat messages simulating a conversation between the human and a bot
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

const coreChatMessage: Message[] = [
  {
    id: 1,
    text: 'Hola, ¿cómo estás?',
    sender: 'user'
  },
  {
    id: 2,
    text: 'Hola! Estoy bien, gracias. ¿En qué puedo ayudarte hoy?',
    sender: 'ai'
  },
  {
    id: 3,
    text: 'Quisiera saber más sobre la inteligencia artificial.',
    sender: 'user'
  },
  {
    id: 4,
    text: 'Claro, la inteligencia artificial es un campo de la informática que se centra en la creación de sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. ¿Te gustaría saber algo específico?',
    sender: 'ai'
  },
  {
    id: 5,
    text: 'Sí, ¿cómo funcionan los modelos de lenguaje como tú?',
    sender: 'user'
  },
  {
    id: 6,
    text: 'Los modelos de lenguaje como yo funcionan utilizando redes neuronales profundas, específicamente un tipo de arquitectura llamada Transformer. Estos modelos son entrenados con grandes cantidades de texto para aprender patrones en el lenguaje y generar respuestas coherentes. ¿Quieres más detalles sobre algún aspecto en particular?',
    sender: 'ai'
  }
]

const chatMessage = coreChatMessage.concat(
  coreChatMessage.map((chat, i) => ({
    ...chat,
    id: i + coreChatMessage.length
  }))
)

export default function Dashboard() {
  return (
    <div className='grid h-screen w-full pl-[56px]'>
      <ChatSideMenu />

      <div className='flex flex-col'>
        <ChatHeader />

        <main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
          {/* Chat Settings */}
          <ChatSettings />

          <div className='relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2'>
            {/* <Badge variant='outline' className='absolute right-3 top-3'>
              Output
            </Badge> */}
            {/* Chat History */}
            <div className='flex-1 max-h-[500px] overflow-y-scroll'>
              {chatMessage.map(message => (
                message.sender === 'ai'
                  ? (<BotBubbleMessage key={message.id} text={message.text} />)
                  : (<HummanBubbleMessage key={message.id} text={message.text} />)
              ))}
            </div>

            {/* Box Input Messages */}
            <form
              className='relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring' x-chunk='dashboard-03-chunk-1'
            >
              <Label htmlFor='message' className='sr-only'>
                Message
              </Label>
              <Textarea
                id='message'
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
          </div>
        </main>
      </div>
    </div>
  )
}
