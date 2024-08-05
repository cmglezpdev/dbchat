import { createOpenAI } from '@ai-sdk/openai'
import { ZodSchema } from 'zod'
import { Config, DbDesign } from '@/types'
import { generateText, generateObject } from 'ai'
import { dbDesignSchema } from '../schemas'
import { organizeRequirementsPrompt, databaseDesignPrompt, extendDatabaseDesignPrompt, generateSQLCommandsPrompt, updateDatabasePrompt, generateDescriptionAboutDbChanges, updateSQLDesignPrompt } from './prompts'

export async function generateDbDesign(input: string, config: Config) {
  const requirements = await textLLMQuery(
    organizeRequirementsPrompt(input),
    config
  )

  const firstDesign = await objectLLMQuery(
    databaseDesignPrompt(requirements),
    dbDesignSchema,
    config
  )

  const extendedDesign = await objectLLMQuery(
    extendDatabaseDesignPrompt(requirements, JSON.stringify(firstDesign)),
    dbDesignSchema,
    config
  )

  const sqlSchema = await textLLMQuery(
    generateSQLCommandsPrompt(extendedDesign),
    config
  )

  return {
    message: requirements,
    jsonDesign: extendedDesign,
    sqlDesign: sqlSchema
  }
}

export async function updateDbDesign(input: string, jsonSchema: DbDesign, sqlSchema: string, config: Config) {
  console.log('Generation new json design')
  const newSchema = await objectLLMQuery(
    updateDatabasePrompt(jsonSchema, input),
    dbDesignSchema,
    config
  )

  console.log('Generating changes description')
  const changes = await textLLMQuery(
    generateDescriptionAboutDbChanges(newSchema, newSchema, input),
    config
  )

  console.log('Generating new sql design')
  const newSqlSchema = await textLLMQuery(
    updateSQLDesignPrompt(newSchema, sqlSchema, changes),
    config
  )

  return {
    message: changes,
    jsonDesign: newSchema,
    sqlDesign: newSqlSchema
  }
}

const textLLMQuery = async (prompt: string, config: Config) => {
  const openai = createOpenAI({ apiKey: config.apiKey })
  const response = await generateText({
    model: openai(config.model),
    system: `Eres un asistente virtual especializado en diseño de software y base de datos ${config.database}.`,
    prompt
  })

  return response.text
}

const objectLLMQuery = async (prompt: string, schema: ZodSchema, config: Config) => {
  const openai = createOpenAI({ apiKey: config.apiKey })
  const response = await generateObject({
    model: openai(config.model),
    system: `Eres un asistente virtual especializado en diseño de software y base de datos ${config.database}.`,
    prompt,
    schema
  })

  return response.object
}
