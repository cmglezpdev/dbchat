import { z, ZodSchema } from 'zod'
import { generateObject, generateText, Message, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { organizeRequirementsPrompt, databaseDesignPrompt, dbDesignSchema, extendDatabaseDesignPrompt, updateDatabasePrompt, generateDescriptionAboutDbChanges } from '@/lib/ai'
import { DbDesign } from '@/types'

export const maxDuration = 30

export enum Tools {
  updateDbJsonDesign = 'updateDbJsonDesign',
  generateSqlCommandsFromJsonDesign = 'generateSqlCommandsFromJsonDesign',
  generateDbJsonSchema = 'generateDbJsonSchema'
}

const PROMPTS_HISTORY: Message[] = []

const postSchema = z.object({
  message: z.object({
    id: z.string(),
    role: z.string(),
    content: z.string()
  }),
  design: dbDesignSchema.nullable().optional()
})

type BodyType = {
  message: Message,
  design: DbDesign
}

export async function POST(req: Request) {
  const body: BodyType = await req.json()
  const { message, design } = body

  const isValid = postSchema.safeParse(body)
  if (!isValid.success) {
    console.error('Bad request.')
    return new Response(JSON.stringify(isValid.error.errors), { status: 400 })
  }

  // saving missing messages history
  PROMPTS_HISTORY.push(message)

  if (!design) {
    console.warn('Missing design. Checking that the user is asking for a db design')
    // TODO: check that the usee is asking for a db design

    console.log('Getting the first db model design')
    const resp = await GetDbDesign(message.content)

    PROMPTS_HISTORY.push({
      id: crypto.randomUUID(),
      role: 'system',
      content: `REQUIREMENTS:\n${resp.requirements}\nDB DESIGN:\n${JSON.stringify(resp.design)}`
    })

    return new Response(JSON.stringify({
      message: {
        id: crypto.randomUUID(),
        role: 'system',
        content: resp.requirements
      },
      design: resp.design
    }), { status: 200 })
  }

  // design provided. check type of question of the user
  console.log('Design provided. Checking type of question.')

  const response = await generateText({
    model: openai('gpt-4o-mini'),
    system: 'Eres un asistente virtual especializado en diseño de software y base de datos.',
    tools: {
      [Tools.updateDbJsonDesign]: tool({
        parameters: z.object({}),
        description: 'The user want to update a un db json design. Update the db design based on the user input',
        execute: async () => {
          console.log(`${Tools.updateDbJsonDesign} called.`)
          const newSchema = await objectLLMQuery(
            updateDatabasePrompt(design, message.content),
            dbDesignSchema
          )

          const changes = await textLLMQuery(
            generateDescriptionAboutDbChanges(design, newSchema, message.content)
          )

          console.log({
            newSchema,
            changes
          })

          PROMPTS_HISTORY.push({
            id: crypto.randomUUID(),
            role: 'system',
            content: `CHANGES\n${changes}\nNEW SCHEMA:\n${JSON.stringify(newSchema)}`
          })

          return {
            design: newSchema,
            message: { id: crypto.randomUUID(), role: 'system', content: changes }
          }
        }
      }),
      [Tools.generateSqlCommandsFromJsonDesign]: tool({
        parameters: z.object({}),
        description: 'The user want to generate sql commands. Get the sql commands to create database from a json design',
        execute: async () => {
          console.log('sqlCommands tool called')
          return {
            message: 'Sql Commands too called'
          }
        }
      }),
      [Tools.generateDbJsonSchema]: tool({
        parameters: z.object({}),
        description: 'Get the sql commands to create database from a design',
        execute: async () => {
          console.log('sqlCommands tool called')
          return {
            message: 'Sql Commands too called'
          }
        }
      })
    },
    toolChoice: 'required',
    prompt: message.content
  })

  const toolResult = response.toolResults[0].result

  return new Response(JSON.stringify({
    ...toolResult,
    response
  }), { status: 200 })
}

export async function GetDbDesign(input: string) {
  const requirements = await textLLMQuery(
    organizeRequirementsPrompt(input)
  )

  const firstDesign = await objectLLMQuery(
    databaseDesignPrompt(requirements),
    dbDesignSchema
  )

  const extendedDesign = await objectLLMQuery(
    extendDatabaseDesignPrompt(requirements, JSON.stringify(firstDesign)),
    dbDesignSchema
  )

  return {
    requirements,
    design: extendedDesign
  }
}

const textLLMQuery = async (prompt: string) => {
  const response = await generateText({
    model: openai('gpt-4o-mini'),
    system: 'Eres un asistente virtual especializado en diseño de software y base de datos.',
    prompt
  })

  return response.text
}

const objectLLMQuery = async (prompt: string, schema: ZodSchema) => {
  const response = await generateObject({
    model: openai('gpt-4o-mini'),
    system: 'Eres un asistente virtual especializado en diseño de software y base de datos.',
    prompt,
    schema
  })

  return response.object
}

// Quiero crear un systema de pagos para usuarios que use las pasarelas de pago stripe y paypal

// Añade una tabla productos de una tienda con su nombre y precio. Además añade la relación de compra de los productos por los usuarios y los pagos

// Elimina el description del producto y añade un fullDescription y un shortDescription, un array de images y un price y cost donde cost es el precio base del producto(adquirido por el vendedor) y price es el precio de venta
