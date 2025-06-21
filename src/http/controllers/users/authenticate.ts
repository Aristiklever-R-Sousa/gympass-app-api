import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateUseCase } from "@/use-cases/authenticate-use-case"
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error"

export async function authenticate(req: Request, res: Response) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(req.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRepository)

        const { user } = await authenticateUseCase.execute({
            email,
            password
        })

        const token = await res.jwtSign(
            {
                role: user.role
            },
            {
                sign: {
                    sub: user.id
                }
            }
        )

        const refreshToken = await res.jwtSign(
            {
                role: user.role
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d',
                },
            }
        )

        return res
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true,
            })
            .status(200)
            .send({
                token
            })

    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return res.status(400).send({ message: err.message })
        }

        throw err
    }

}
