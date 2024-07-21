export function HummanBubbleMessage({ text }: { text: string }) {
  return (
    <div className='col-start-6 col-end-13 p-3 rounded-lg'>
      <div className='flex items-center justify-start flex-row-reverse'>
        <div className='flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 flex-shrink-0'>
          G
        </div>
        <div className='relative mr-3 text-sm bg-indigo-600 bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          <p>{text}</p>
        </div>
      </div>
    </div>
  )
}
