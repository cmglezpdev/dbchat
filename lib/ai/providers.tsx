import {
  ClaudeAIIcon, ESFlagIcon, MariaDBIcon,
  MicrosoftSQLServerIcon, MySQLIcon,
  OpenAIIcon, PostgreSQLIcon,
  SQLiteIcon, UKFlagIcon
} from '@/components/icons'

export const providerOptions = {
  langs: [
    {
      name: 'English',
      value: 'en',
      icon: <UKFlagIcon className='size-5' />
    },
    {
      name: 'Español',
      value: 'es',
      icon: <ESFlagIcon className='size-5' />
    }
  ],
  providers: [
    {
      provider: 'OpenAI',
      name: 'GPT-4o mini',
      model: 'gpt-4o-mini',
      icon: <OpenAIIcon className='size-5' />
    },
    {
      provider: 'OpenAI',
      name: 'GPT-4o',
      model: 'gpt-4o',
      icon: <OpenAIIcon className='size-5' />
    },
    {
      provider: 'Anthropic',
      name: 'Claude 3.5 Sonnet',
      model: 'claude-3-5-sonnet-20240620',
      icon: <ClaudeAIIcon className='size-5' />
    },
    {
      provider: 'Anthropic',
      name: 'Claude 3 Opus',
      model: 'claude-3-opus-20240229',
      icon: <ClaudeAIIcon className='size-5' />
    },
    {
      provider: 'Anthropic',
      name: 'Claude 3 Sonnet',
      model: 'claude-3-sonnet-20240229',
      icon: <ClaudeAIIcon className='size-5' />
    },
    {
      provider: 'Anthropic',
      name: 'Claude 3 Haiku',
      model: 'claude-3-haiku-20240307',
      icon: <ClaudeAIIcon className='size-5' />
    }
  ],
  databases: [
    {
      name: 'PostgreSQL',
      value: 'postgresql',
      icon: <PostgreSQLIcon className='size-5' />
    },
    {
      name: 'SQLite',
      value: 'sqlite',
      icon: <SQLiteIcon className='size-5' />
    },
    {
      name: 'MySQL',
      value: 'mysql',
      icon: <MySQLIcon className='size-5' />
    },
    {
      name: 'MariaDB',
      value: 'mariadb',
      icon: <MariaDBIcon className='size-5' />
    },
    {
      name: 'MySQL Server',
      value: 'mysql-server',
      icon: <MicrosoftSQLServerIcon className='size-5' />
    }
  ]
}
