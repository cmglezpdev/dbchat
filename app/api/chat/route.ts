import { generateObject, generateText, Message } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { BodyType, Config, DbDesign } from '@/types'
import { ApiChatSchema, dbDesignSchema } from '@/lib/schemas'
import {
  organizeRequirementsPrompt,
  databaseDesignPrompt,
  extendDatabaseDesignPrompt,
  updateDatabasePrompt,
  generateDescriptionAboutDbChanges,
  generateSQLCommandsPrompt,
  updateSQLDesignPrompt
} from '@/lib/ai'
import { ZodSchema } from 'zod'

export const maxDuration = 30
const PROMPTS_HISTORY: Message[] = []

export async function POST(req: Request) {
  const body: BodyType = await req.json()
  const { message, jsonDesign, sqlDesign, config } = body

  const isValid = ApiChatSchema.safeParse(body)
  if (!isValid.success) {
    console.error('Bad request.')
    return new Response(JSON.stringify(isValid.error.errors), { status: 400 })
  }

  // saving missing messages history
  PROMPTS_HISTORY.push(message)

  if (!jsonDesign) {
    try {
      console.warn('Missing design. Checking that the user is asking for a db design')
      // TODO: check that the user is asking for a db design

      console.log('Getting the first db model design')
      const resp = await GenerateDbDesign(message.content, config)

      PROMPTS_HISTORY.push({
        id: crypto.randomUUID(),
        role: 'system',
        content: `
          REQUIREMENTS:
          ${resp.message}
          DB JSON DESIGN:
          ${JSON.stringify(resp.jsonDesign)}
          DB SQL DESIGN:
          \n${resp.sqlDesign}`
      })

      return new Response(JSON.stringify({
        message: {
          id: crypto.randomUUID(),
          role: 'system',
          content: resp.message
        },
        jsonDesign: resp.jsonDesign,
        sqlDesign: resp.sqlDesign
      }), { status: 200 })
    } catch (error: any) {
      const errorMessage = error.data?.error?.message ?? 'Bad Request. Maybe Invalid ApiKey'
      console.log({ message: errorMessage })
      return new Response(JSON.stringify({
        message: errorMessage
      }), { status: 400 })
    }
  }

  try {
    // design provided. check type of question of the user
    // TODO:
    console.log('Design provided. Checking type of question.')

    const resp = await UpdateDbDesign(message.content, jsonDesign, sqlDesign, config)

    PROMPTS_HISTORY.push({
      id: crypto.randomUUID(),
      role: 'system',
      content: `
        REQUIREMENTS:
        ${resp.message}
        DB JSON DESIGN:
        ${JSON.stringify(resp.jsonDesign)}
        DB SQL DESIGN:
        \n${resp.sqlDesign}`
    })

    return new Response(JSON.stringify({
      message: {
        id: crypto.randomUUID(),
        role: 'system',
        content: resp.message
      },
      jsonDesign: resp.jsonDesign,
      sqlDesign: resp.sqlDesign
    }), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({
      error
    }), { status: 400 })
  }
}

async function GenerateDbDesign(input: string, config: Config) {
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

async function UpdateDbDesign(input: string, jsonSchema: DbDesign, sqlSchema: string, config: Config) {
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

// Quiero crear un systema de pagos para usuarios que use las pasarelas de pago stripe y paypal

// Añade una tabla productos de una tienda con su nombre y precio. Además añade la relación de compra de los productos por los usuarios y los pagos

// Elimina el description del producto y añade un fullDescription y un shortDescription, un array de images y un price y cost donde cost es el precio base del producto(adquirido por el vendedor) y price es el precio de venta
