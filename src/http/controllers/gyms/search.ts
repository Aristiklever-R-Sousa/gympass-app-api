import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case"

export async function search(req: Request, res: Response) {
    const searchGymsQuerySchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1),
    })

    const { q, page } = searchGymsQuerySchema.parse(req.query)

    const searchGymsUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchGymsUseCase.execute({
        title: q,
        page,
    })

    return res.status(200).send({
        gyms,
    })

}
