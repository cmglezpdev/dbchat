import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { ZodSchema } from 'zod'
import { Config, DbDesign } from '@/types'
import { generateText, generateObject } from 'ai'
import { dbDesignSchema } from '../schemas'
import { Prompts } from './prompts'
import { providerOptions } from './providers'

export async function generateDbDesign(input: string, config: Config) {
  const requirements = await textLLMQuery(
    Prompts(config.lang).organizeRequirementsPrompt(input, config.database),
    config
  )

  const firstDesign = await objectLLMQuery(
    Prompts(config.lang).databaseDesignPrompt(requirements, config.database, config.styles),
    dbDesignSchema,
    config
  )

  const extendedDesign = await objectLLMQuery(
    Prompts(config.lang).extendDatabaseDesignPrompt(requirements, firstDesign, config.styles),
    dbDesignSchema,
    config
  )

  const sqlSchema = await textLLMQuery(
    Prompts(config.lang).generateSQLCommandsPrompt(extendedDesign, config.database, config.styles),
    config
  )

  const updRequirements = await textLLMQuery(
    Prompts(config.lang).updateRequirementsPrompt(requirements, extendedDesign),
    config
  )

  return {
    message: updRequirements,
    jsonDesign: extendedDesign,
    sqlDesign: sqlSchema
  }
}

export async function updateDbDesign(input: string, jsonSchema: DbDesign, sqlSchema: string, config: Config) {
  console.log('Generation new json design')
  const newSchema = await objectLLMQuery(
    Prompts(config.lang).updateDatabasePrompt(jsonSchema, input, config.styles),
    dbDesignSchema,
    config
  )

  console.log('Generating changes description')
  const changes = await textLLMQuery(
    Prompts(config.lang).generateDescriptionAboutDbChanges(jsonSchema, newSchema, input),
    config
  )

  console.log('Generating new sql design')
  const newSqlSchema = await textLLMQuery(
    Prompts(config.lang).updateSQLDesignPrompt(jsonSchema, newSchema, sqlSchema, changes, config.database, config.styles),
    config
  )

  return {
    message: changes,
    jsonDesign: newSchema,
    sqlDesign: newSqlSchema
  }
}

const textLLMQuery = async (prompt: string, config: Config) => {
  const response = await generateText({
    model: getLLMModel(config),
    system: getSystemPrompt(config),
    prompt
  })

  return response.text
}

const objectLLMQuery = async (prompt: string, schema: ZodSchema, config: Config) => {
  const response = await generateObject({
    model: getLLMModel(config),
    system: getSystemPrompt(config),
    prompt,
    schema
  })

  return response.object
}

function getLLMModel(config: Config) {
  const option = providerOptions.providers.find(
    option => option.model === config.model
  )

  if (!option) {
    console.error(`The model is not valid: (${config.model})`)
    throw new Error(`The model is not valid: (${config.model})`)
  }

  switch (option.provider.toLowerCase()) {
    case 'openai':
      return createOpenAI({ apiKey: config.apiKey })(config.model)
    case 'anthropic':
      return createAnthropic({ apiKey: config.apiKey })(config.model)
    default:
      throw new Error('Invalid model. The flow shouldn\'t arrive here!')
  }
}

const getSystemPrompt = (config: Config) => {
  return `Eres un asistente virtual especializado en diseño de software y base de datos ${config.database}.`
}
