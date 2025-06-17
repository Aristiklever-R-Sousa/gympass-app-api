import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case"

export async function nearby(req: Request, res: Response) {
    const nearbyGymsQuerySchema = z.object({
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90 // valor encontrado no google
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180 // valor encontrado no google
        })
    })

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await fetchNearbyGymsUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return res.status(200).send({
        gyms,
    })

}
