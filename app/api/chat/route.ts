import { generateDbDesign, updateDbDesign } from '@/lib/ai/utils'
import { ApiChatSchema } from '@/lib/schemas'
import { BodyType } from '@/types'
import { Message } from 'ai'

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
      const resp = await generateDbDesign(message.content, config)

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

    const resp = await updateDbDesign(message.content, jsonDesign, sqlDesign, config)

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

// Quiero crear un systema de pagos para usuarios que use las pasarelas de pago stripe y paypal
// Añade una tabla productos de una tienda con su nombre y precio. Además añade la relación de compra de los productos por los usuarios y los pagos
// Elimina el description del producto y añade un fullDescription y un shortDescription, un array de images y un price y cost donde cost es el precio base del producto(adquirido por el vendedor) y price es el precio de venta
