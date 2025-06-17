import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case"

export async function create(req: Request, res: Response) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90 // valor encontrado no google
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180 // valor encontrado no google
        })
    })

    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(req.body)

    const createGymUseCase = makeCreateGymUseCase()

    const dataCreated = await createGymUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    })

    return res.status(201).send({
        data: dataCreated,
    })

}
