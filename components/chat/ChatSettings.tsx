type Props = {
  jsonDesign: object | null;
  sqlDesign: string | null;
}

export function ChatSettings({ jsonDesign, sqlDesign }: Props) {
  return (
    <aside className='grid w-full items-start gap-6'>
      <pre>
        {JSON.stringify(jsonDesign, null, 3)}
      </pre>
      <pre>
        {sqlDesign}
      </pre>
    </aside>
  )
}
