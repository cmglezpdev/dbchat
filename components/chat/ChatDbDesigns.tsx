/* eslint-disable indent */
import { DbDesign } from '@/types'
import { CardEntity } from '../db-design'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Markdown from 'react-markdown'
import { DatabaseOff, TableOff } from '../icons'

type Props = {
  jsonDesign: DbDesign | null;
  sqlDesign: string | null;
}

export function ChatDbDesigns({ jsonDesign, sqlDesign }: Props) {
  return (
    <aside className='w-full max-h-[90vh] overflow-auto pb-20 md:mb-auto'>
      <Tabs defaultValue='design' className='w-full'>
        <div className='w-full flex justify-center'>
          <TabsList className=''>
            <TabsTrigger value='design'>Design</TabsTrigger>
            <TabsTrigger value='code'>Code</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='design' className='flex flex-wrap w-full items-start gap-6 justify-center'>
          {jsonDesign
            ? (jsonDesign.design.map((entity, i) => (
              <CardEntity
                key={i}
                entity={entity}
              />
            )))
            : (
              <div className='flex flex-col justify-center items-center min-h-[100px] gap-2'>
                <DatabaseOff className='text-muted-foreground scale-150' />
                <p className='text-sm text-muted-foreground'>Schema not generated</p>
              </div>
            )}
        </TabsContent>
        <TabsContent value='code' className='flex flex-wrap w-full items-start gap-6 justify-center'>
          {sqlDesign
            ? (
              <Markdown className=''>
                {sqlDesign}
              </Markdown>
            )
            : (
              <div className='flex flex-col justify-center items-center min-h-[100px] gap-2'>
                <TableOff className='text-muted-foreground scale-150' />
                <p className='text-sm text-muted-foreground'>Sql not generated</p>
              </div>
            )}
        </TabsContent>
      </Tabs>
    </aside>
  )
}
