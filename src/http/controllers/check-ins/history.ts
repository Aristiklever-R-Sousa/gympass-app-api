import { FastifyRequest as Request, FastifyReply as Response } from "fastify"
import { z } from "zod"

import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case"

export async function history(req: Request, res: Response) {
    const checkInHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    })

    const { page } = checkInHistoryQuerySchema.parse(req.query)

    const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
        userId: req.user.sub,
        page,
    })

    return res.status(200).send({
        checkIns,
    })

}
