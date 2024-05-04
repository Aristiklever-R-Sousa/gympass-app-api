import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { hash } from 'bcryptjs'
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { RegisterUseCase } from "@/use-cases/registerUseCase"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"

export async function register(req: Request, res: Response) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userCreated = await registerUseCase.execute({
      name,
      email,
      password
    })

    return res.status(201).send({
      data: userCreated,
    })
  } catch (err) {
    return res.status(409).send()
  }

}
