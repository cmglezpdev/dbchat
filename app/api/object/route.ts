import { databaseDesignPrompt, dbDesignSchema, extendDatabaseDesignPrompt, organizeRequirementsPrompt } from '@/lib/ai'
import { openai } from '@ai-sdk/openai'
import { generateObject, generateText } from 'ai'
import { ZodSchema } from 'zod'

export const maxDuration = 30

export async function POST(req: Request) {
  const body = await req.json()
  const { input } = body

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

  const { design } = extendedDesign

  return new Response(JSON.stringify({
    requirements,
    design
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
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

// También basado en tus conocimientos de negocio, genera una descripción del negocio basada en los requerimientos y que esté enfocada en el desarrollo de software, para que le sirva a un desarrollador de sogtware diseñar una base de datos.
