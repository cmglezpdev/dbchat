import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const body = await req.json()
  const { requirements, design } = body

  const response = await streamText({
    model: openai('gpt-4o-mini'),
    system: 'Eres un asistente virtual especializado en diseño de software y base de datos.',
    prompt: `
      Dado el siguiente esquema que representa la modelación de una base de datos para una aplicación con unos requerimientos específicos. 
      Tu tarea es generar una descripción coherente de dicha modelación que explique en que consiste el modelo creado y como resulve los requerimientos del usuario.
      Solo responde con la información necesaria. NO añadas text adicional para adornar la respuesta.
      
      REQUERIMIENTOS DE LA APLICACIÓN:
      ${requirements}

      DISEÑO DE LA BASE DE DATOS:
      ${JSON.stringify(design)}

      TU RESPUESTA:
    `
  })

  return response.toAIStreamResponse()
}
