import { Settings, Code } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { OpenAIIcon } from '../icons'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '../ui/drawer'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'

export function ChatHeader() {
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
          <form className='grid w-full items-start gap-6 overflow-auto p-4 pt-0'>
            <fieldset className='grid gap-6 rounded-lg border p-4'>
              <legend className='-ml-1 px-1 text-sm font-medium'>
                Settings
              </legend>
              <div className='grid gap-3'>
                <Label htmlFor='model'>Model</Label>
                <Select>
                  <SelectTrigger
                    id='model'
                    className='items-start [&_[data-description]]:hidden'
                  >
                    <SelectValue placeholder='Select a model' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='gpt4o-mini'>
                      <div className='flex items-start gap-3 text-muted-foreground'>
                        <div className='flex items-center'>
                          <OpenAIIcon className='size-5' />
                        </div>
                        <div className='grid gap-0.5'>
                          <p>
                            OpenAI{' '}
                            <span className='font-medium text-foreground'>
                              GPT-4o mini
                            </span>
                          </p>
                          <p className='text-xs' data-description>
                            Our most cost-efficient small model
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='api_key'>Api Key</Label>
                <Input id='api_key' type='password' placeholder='sk-proj-tghRGo3dGkedvb63FG1dgl' />
              </div>
            </fieldset>
          </form>
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
          <form className='grid w-full items-start gap-6 overflow-auto p-4 pt-0'>
            <fieldset className='grid gap-6 rounded-lg border p-4'>
              <legend className='-ml-1 px-1 text-sm font-medium'>
                Settings
              </legend>
              <div className='grid gap-3'>
                <Label htmlFor='model'>Model</Label>
                <Select>
                  <SelectTrigger
                    id='model'
                    className='items-start [&_[data-description]]:hidden'
                  >
                    <SelectValue placeholder='Select a model' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='gpt4o-mini'>
                      <div className='flex items-start gap-3 text-muted-foreground'>
                        <div className='flex items-center'>
                          <OpenAIIcon className='size-5' />
                        </div>
                        <div className='grid gap-0.5'>
                          <p>
                            OpenAI{' '}
                            <span className='font-medium text-foreground'>
                              GPT-4o mini
                            </span>
                          </p>
                          <p className='text-xs' data-description>
                            Our most cost-efficient small model
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='api_key'>Api Key</Label>
                <Input id='api_key' type='password' placeholder='sk-proj-tghRGo3dGkedvb63FG1dgl' />
              </div>
            </fieldset>
          </form>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant='outline'
        size='sm'
        className='ml-auto gap-1.5 text-sm md:hidden'
      >
        <Code className='size-3.5' />
        Code
      </Button>
    </header>
  )
}
