'use client'
import { ChatHeader } from '@/components/chat'
import { ChatScreen } from '@/screens'

export default function Dashboard() {
  return (
    <div className='grid h-screen w-full'>
      <div className='flex flex-col'>
        <ChatHeader />

        <ChatScreen />
      </div>
    </div>
  )
}
