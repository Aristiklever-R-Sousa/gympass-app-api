import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, } from "vitest";

describe("Create Gym (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        const response = await request(app.server)
            .post('/gyms')
            .auth(token, { type: 'bearer' })
            .send({
                title: 'Example',
                description: 'Somo description',
                phone: '1199999999',
                latitude: -3.5220479,
                longitude: -40.3502656,
            })

        expect(response.statusCode).toEqual(201)
    })
})
