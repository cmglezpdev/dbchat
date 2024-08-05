import { z } from 'zod'

export const dbDesignSchema = z.object({
  design: z.array(
    z.object({
      name: z.string(),
      attributes: z.array(z.string()),
      primary_keys: z.array(z.string()),
      foreign_keys: z.array(
        z.object({
          id: z.string(),
          reference: z.string()
        })
      )
    })
  )
})
