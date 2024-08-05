import { z } from 'zod'
import { dbDesignSchema } from './db-json-schema'

export const ApiChatSchema = z.object({
  message: z.object({
    id: z.string(),
    role: z.string(),
    content: z.string()
  }),
  jsonDesign: dbDesignSchema.nullable().optional(),
  sqlDesign: z.string().nullable().optional(),
  config: z.object({
    model: z.string(),
    apiKey: z.string(),
    database: z.string().nullable().optional()
  })
})
