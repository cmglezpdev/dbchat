import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Entity } from '@/types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

type Props = {
  entity: Entity;
}

export function CardEntity({ entity }: Props) {
  return (
    <Card className='w-full max-w-[200px]'>
      <CardHeader className='p-3'>
        <CardTitle className='text-sm'>{entity.name}</CardTitle>
      </CardHeader>
      <CardContent className='text-xs p-3'>
        <div className='grid gap-4'>
          {/* PRIMARY KEYS */}
          {entity.primary_keys.map(key => (
            <div key={key} className='grid grid-cols-[16px_1fr] items-center gap-2'>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='w-4 h-4 rounded-full bg-primary' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <strong>Primary key</strong>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className='font-medium'>{key}</div>
            </div>
          ))}

          {/* REST OF PROPERTIES */}
          {entity.attributes
            .filter(key => !entity.primary_keys.includes(key))
            .filter(key => !entity.foreign_keys.some(fk => fk.id === key))
            .map(key => (
              <div key={key} className='grid grid-cols-[16px_1fr] items-center gap-2 text-xs'>
                <div className='w-full' />
                <div className='font-medium'>{key}</div>
              </div>
            ))}

          {entity.foreign_keys.map(fk => (
            <div key={fk.id} className='grid grid-cols-[16px_1fr] items-center gap-2 text-xs'>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='w-4 h-4 rounded-full bg-secondary border-black border' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <strong>Foregin Key:</strong> {fk.reference}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className='font-medium'>{fk.id}</div>
            </div>
          ))}

        </div>
      </CardContent>
    </Card>
  )
}
