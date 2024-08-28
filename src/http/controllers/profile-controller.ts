import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case"
import { FastifyRequest as Request, FastifyReply as Response } from "fastify"

export async function profile(req: Request, res: Response) {

    const getUserProfile = makeGetUserProfileUseCase()

    const { user } = await getUserProfile.execute({ userId: req.user.sub })

    return res.status(200).send({ user: { ...user, password_hash: undefined } })

}
