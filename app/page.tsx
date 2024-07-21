'use client'
import { ChatHeader } from '@/components/chat'
import { ChatSideMenu } from '@/components/menu'
import { ChatScreen } from '@/screens'

export default function Dashboard() {
  return (
    <div className='grid h-screen w-full pl-[56px]'>
      <ChatSideMenu />

      <div className='flex flex-col'>
        <ChatHeader />

        <ChatScreen />
      </div>
    </div>
  )
}
