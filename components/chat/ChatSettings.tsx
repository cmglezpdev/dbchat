type Props = {
  dbDesign: object | null
}

export function ChatSettings({ dbDesign }: Props) {
  return (
    <aside className='grid w-full items-start gap-6'>
      <pre>
        {JSON.stringify(dbDesign, null, 3)}
      </pre>
    </aside>
  )
}
