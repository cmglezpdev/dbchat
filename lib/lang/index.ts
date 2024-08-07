export * from './en'
export * from './es'

export interface ITranduction {
  header: {
    title: string,
    configTitle: string,
    configDescription: string,
    continueButton: string,

    settingsTitle: string,
    modelTitle: string,
    databaseTitle: string,
    apiKeyTitle: string,
    extraTitle: string,
    databaseStylesTitle: string
  },
  chatScreen: {
    firstMessage: string,
    dbDesign: {
      title: string,
      designTitle: string,
      codeTitle: string,
      schemaNotFound: string,
      sqlNotFound: string
    },
    history: {},
    input: {
      placeholder: string
    }
  }
}
