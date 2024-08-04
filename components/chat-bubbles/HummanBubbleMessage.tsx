export function HummanBubbleMessage({ text }: { text: string }) {
  return (
    <div className='flex justify-end'>
      <div className='bg-primary text-primary-foreground rounded-lg rounded-br-none px-4 py-3 max-w-[65%]'>
        {text}
      </div>
    </div>
  )
}
