import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case"

export async function create(req: Request, res: Response) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90 // valor encontrado no google
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180 // valor encontrado no google
        })
    })

    const { gymId } = createCheckInParamsSchema.parse(req.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(req.query)

    const createCheckInUseCase = makeCheckInUseCase()

    const { checkIn } = await createCheckInUseCase.execute({
        userId: req.user.sub,
        gymId,
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return res.status(201).send({
        checkIn,
    })

}
