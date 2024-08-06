import { Settings, Code } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ChatDbDesigns } from './ChatDbDesigns'
import { useConfigStore, useDesignStore } from '@/store'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerFooter } from '../ui/drawer'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { providerOptions } from '@/lib/ai/providers'

export function ChatHeader() {
  const { jsonDesign, sqlDesign } = useDesignStore()

  return (
    <header className='sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4'>
      <h1 className='text-xl font-semibold'>Playground</h1>

      {/* Menu in mobile view */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='ghost' size='icon' className='md:hidden'>
            <Settings className='size-4' />
            <span className='sr-only'>Settings</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className='max-h-[80vh]'>
          <DrawerHeader>
            <DrawerTitle>Configuration</DrawerTitle>
            <DrawerDescription>
              Configure the settings for the model and messages.
            </DrawerDescription>
          </DrawerHeader>
          <HeaderSettings />
          <DrawerFooter className='flex items-end justify-end'>
            <DrawerClose asChild className='max-w-min'>
              <Button>Continue</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Menu in desktop view */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='ghost' size='icon' className='hidden md:flex'>
            <Settings className='size-4' />
            <span className='sr-only'>Settings</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='max-h-[80vh]'>
          <AlertDialogHeader>
            <AlertDialogTitle>Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Configure the settings for the model and messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <HeaderSettings />
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Database Design in mobile view */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='ml-auto gap-1.5 text-sm md:hidden'
          >
            <Code className='size-3.5' />
            Code
          </Button>
        </SheetTrigger>
        <SheetContent side='bottom' className='w-screen h-[90vh]'>
          <SheetHeader>
            <SheetTitle>Database Design</SheetTitle>
          </SheetHeader>
          <ChatDbDesigns
            jsonDesign={jsonDesign}
            sqlDesign={sqlDesign}
          />
        </SheetContent>
      </Sheet>
    </header>
  )
}

function HeaderSettings() {
  const { model, apiKey, database, setApiKey, setModel, setDatabase } = useConfigStore()

  return (
    <form className='grid w-full items-start gap-6 overflow-auto p-4 pt-0'>
      <fieldset className='grid gap-6 rounded-lg border p-4'>
        <legend className='-ml-1 px-1 text-sm font-medium'>
          Settings
        </legend>
        {/* Model */}
        <div className='grid gap-3'>
          <Label htmlFor='model'>Model</Label>
          <Select onValueChange={(value) => setModel(value)} value={model}>
            <SelectTrigger
              id='model'
              className='items-start [&_[data-description]]:hidden'
            >
              <SelectValue placeholder='Select a model' />
            </SelectTrigger>
            <SelectContent>
              {providerOptions.providers.map(option => (
                <SelectItem key={option.model} value={option.model}>
                  <div className='flex items-start gap-3 text-muted-foreground'>
                    <div className='flex items-center'>
                      {option.icon}
                    </div>
                    <div className='grid gap-0.5'>
                      <p>
                        {option.provider}{' '}
                        <span className='font-medium text-foreground'>
                          {option.name}
                        </span>
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Database */}
        <div className='grid gap-3'>
          <Label htmlFor='database'>Database</Label>
          <Select onValueChange={(value) => setDatabase(value)} value={database}>
            <SelectTrigger
              id='database'
              className='items-start [&_[data-description]]:hidden'
            >
              <SelectValue placeholder='Select a database' />
            </SelectTrigger>
            <SelectContent>
              {providerOptions.databases.map(database => (
                <SelectItem key={database.value} value={database.value}>
                  <div className='flex items-start gap-3 text-muted-foreground py-1'>
                    <div className='flex items-center'>
                      {database.icon}
                    </div>
                    <div className='grid gap-0.5'>
                      <span className='font-medium text-foreground'>
                        {database.name}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Api Key */}
        <div className='grid gap-3'>
          <Label htmlFor='api_key'>Api Key</Label>
          <Input
            id='api_key'
            type='password'
            placeholder='sk-proj-tghRGo3dGkedvb63FG1dgl'
            onChange={(e) => setApiKey(e.target.value)}
            value={apiKey ?? ''}
          />
        </div>
      </fieldset>
    </form>
  )
}
