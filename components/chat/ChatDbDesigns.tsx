import { DbDesign } from '@/types'
import { CardEntity } from '../db-design'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Markdown from 'react-markdown'

type Props = {
  jsonDesign: DbDesign | null;
  sqlDesign: string | null;
}

export function ChatDbDesigns({ jsonDesign, sqlDesign }: Props) {
  return (
    <aside className='w-full'>
      <Tabs defaultValue='design' className='w-full'>
        <div className='w-full flex justify-center'>
          <TabsList className=''>
            <TabsTrigger value='design'>Design</TabsTrigger>
            <TabsTrigger value='code'>Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='design' className='flex flex-wrap w-full items-start gap-6 justify-center'>
          {jsonDesign && (
            jsonDesign.design.map((entity, i) => (
              <CardEntity
                key={i}
                entity={entity}
              />
            ))
          )}
        </TabsContent>
        <TabsContent value='code' className='w-full flex justify-center'>
          <Markdown>
            {sqlDesign}
          </Markdown>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
