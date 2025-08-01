import { FastifyRequest as Request, FastifyReply as Response } from "fastify"

export async function refresh(req: Request, res: Response) {
    await req.jwtVerify({
        onlyCookie: true
    })

    const { role, sub } = req.user

    const token = await res.jwtSign(
        {
            role
        },
        {
            sign: {
                sub
            }
        }
    )

    const refreshToken = await res.jwtSign(
        {
            role
        },
        {
            sign: {
                sub,
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

}
