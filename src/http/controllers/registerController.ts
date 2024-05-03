import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

export async function register(req: Request, res: Response) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  const userCreated = await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password
    }
  })

  return res.status(201).send({
    data: userCreated,
  })
}
