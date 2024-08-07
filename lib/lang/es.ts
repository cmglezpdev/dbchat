import { ITranduction } from '.'

export const WebContentES: ITranduction = {
  header: {
    title: 'DB Chat',
    configTitle: 'Configuración',
    configDescription: 'Configuración general del chat',
    continueButton: 'Continue',

    settingsTitle: 'Configuración',
    modelTitle: 'Modelo',
    databaseTitle: 'Base de datos',
    apiKeyTitle: 'API Key',
    extraTitle: 'Extra',
    databaseStylesTitle: 'Estilo de base de datos'
  },
  chatScreen: {
    firstMessage: 'Hola, cuéntame cuales son los requerimientos de tu aplicación y te ayudaré a modelar una base de datos para tí.',
    dbDesign: {
      title: 'Diseño de la base de datos',
      designTitle: 'Diseño',
      codeTitle: 'Código',
      schemaNotFound: 'No hay esquema',
      sqlNotFound: 'No hay código sql'
    },
    history: {},
    input: {
      placeholder: 'Necesito generar algo cool para mi panadería...'
    }
  }
}
