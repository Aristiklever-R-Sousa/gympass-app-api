import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case"

export async function register(req: Request, res: Response) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const registerUseCase = makeRegisterUseCase()

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
