import { FastifyRequest as Request, FastifyReply as Response } from "fastify"

import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case"

export async function metrics(req: Request, res: Response) {

    const fetchUserCheckInsHistoryUseCase = makeGetUserMetricsUseCase()

    const { checkInsCount } = await fetchUserCheckInsHistoryUseCase.execute({
        userId: req.user.sub,
    })

    return res.status(200).send({
        checkInsCount,
    })

}
