import './typing-loader.css'

export function TypingLoader({ className }: { className?: string }) {
  return (
    <div className={className + ' typing'}>
      <span className='circle scaling' />
      <span className='circle scaling' />
      <span className='circle scaling' />
    </div>
  )
}
