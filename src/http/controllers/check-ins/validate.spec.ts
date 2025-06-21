import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, } from "vitest";

describe("Validate Check-in (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const responseGym = await request(app.server)
            .post('/gyms')
            .auth(token, { type: 'bearer' })
            .send({
                title: 'Example',
                description: 'Somo description',
                phone: '1199999999',
                latitude: -3.5220479,
                longitude: -40.3502656,
            })

        const { gym } = responseGym.body

        const responseCheckIn = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .auth(token, { type: 'bearer' })
            .send({
                latitude: -3.5220479,
                longitude: -40.3502656,
            })

        const { checkIn } = responseCheckIn.body

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .auth(token, { type: 'bearer' })
            .send()

        expect(response.statusCode).toEqual(204)

        const checkInValidated = await prisma.checkIn.findFirstOrThrow({
            where: {
                id: checkIn.id,
            }
        })
        expect(checkInValidated.validated_at).toEqual(expect.any(Date))

    })
})
