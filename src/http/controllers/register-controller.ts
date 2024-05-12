import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { RegisterUseCase } from "@/use-cases/register-use-case"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"

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
    if (err instanceof UserAlreadyExistsError) {
      return res.status(409).send({ message: err.message })
    }

    return res.status(500).send()
  }

}
