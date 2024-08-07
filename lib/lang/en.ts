import { ITranduction } from '.'

export const WebContentEN: ITranduction = {
  header: {
    title: 'DB Chat',
    configTitle: 'Configuration',
    configDescription: 'Chat general configuration.',
    continueButton: 'Continue',

    settingsTitle: 'Settings',
    modelTitle: 'Model',
    databaseTitle: 'Database',
    apiKeyTitle: 'API Key',
    extraTitle: 'Extra',
    databaseStylesTitle: 'Database Styles'
  },
  chatScreen: {
    firstMessage: 'Hello, tell me what your application requirements are and I will help you design a database for you.',
    dbDesign: {
      title: 'Database Design',
      designTitle: 'Design',
      codeTitle: 'Code',
      schemaNotFound: 'Schema not generated',
      sqlNotFound: 'SQL not generated'
    },
    history: {},
    input: {
      placeholder: 'I need to create something cool for my bakery...'
    }
  }
}
