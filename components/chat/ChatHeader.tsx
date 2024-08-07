import { Settings, Code } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ChatDbDesigns } from './ChatDbDesigns'
import { useConfigStore, useDesignStore, useLang } from '@/store'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerFooter } from '../ui/drawer'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { providerOptions } from '@/lib/ai/providers'
import { Textarea } from '../ui/textarea'

export function ChatHeader() {
  const { jsonDesign, sqlDesign } = useDesignStore()
  const { data } = useLang(({ data }) => ({ data }))

  return (
    <header className='sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4'>
      <h1 className='text-xl font-semibold'>{data.header.title}</h1>

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
            <DrawerTitle>{data.header.configTitle}</DrawerTitle>
            <DrawerDescription>
              {data.header.configDescription}
            </DrawerDescription>
          </DrawerHeader>
          <HeaderSettings />
          <DrawerFooter className='flex items-end justify-end'>
            <DrawerClose asChild className='max-w-min'>
              <Button>{data.header.continueButton}</Button>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{data.header.configTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {data.header.configDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <HeaderSettings />
          <AlertDialogFooter>
            <AlertDialogAction>{data.header.continueButton}</AlertDialogAction>
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
            {data.chatScreen.dbDesign.designTitle}
          </Button>
        </SheetTrigger>
        <SheetContent side='bottom' className='w-screen h-[90vh]'>
          <SheetHeader>
            <SheetTitle>{data.chatScreen.dbDesign.title}</SheetTitle>
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
  const {
    model, apiKey, database, styles,
    setApiKey, setModel, setDatabase, setStyles
  } = useConfigStore()
  const {
    lang, setLang, data
  } = useLang()

  return (
    <form className='grid w-full items-start gap-6 overflow-auto p-4 pt-0'>
      <fieldset className='grid gap-6 rounded-lg border p-4'>
        <legend className='-ml-1 px-1 text-sm font-medium'>
          {data.header.settingsTitle}
        </legend>

        {/* Language */}
        <div className='grid gap-3'>
          <Label htmlFor='lang'>{data.header.settingsTitle}</Label>
          <Select onValueChange={(value) => setLang(value)} value={lang}>
            <SelectTrigger
              id='lang'
              className='items-start [&_[data-description]]:hidden'
            >
              <SelectValue placeholder='Select a language' />
            </SelectTrigger>
            <SelectContent>
              {providerOptions.langs.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className='flex items-start gap-3 text-muted-foreground'>
                    <div className='flex items-center'>
                      {option.icon}
                    </div>
                    <div className='grid gap-0.5'>
                      <span className='font-medium text-foreground'>
                        {option.name}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div className='grid gap-3'>
          <Label htmlFor='model'>{data.header.modelTitle}</Label>
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
          <Label htmlFor='database'>{data.header.databaseTitle}</Label>
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
          <Label htmlFor='api_key'>{data.header.apiKeyTitle}</Label>
          <Input
            id='api_key'
            type='password'
            placeholder='sk-proj-tghRGo3dGkedvb63FG1dgl'
            onChange={(e) => setApiKey(e.target.value)}
            value={apiKey ?? ''}
          />
        </div>
      </fieldset>

      <fieldset className='grid gap-6 rounded-lg border p-4'>
        <legend className='-ml-1 px-1 text-sm font-medium'>
          {data.header.extraTitle}
        </legend>
        <div className='grid gap-3'>
          <Label htmlFor='content'>{data.header.databaseStylesTitle}</Label>
          <Textarea
            id='content'
            placeholder='short names, all in english, ...'
            onChange={(e) => setStyles(e.target.value)}
            value={styles ?? ''}
          />
        </div>
      </fieldset>
    </form>
  )
}
