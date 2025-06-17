import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, } from "vitest";

describe("Nearby Gyms (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search a nearbys gym', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .auth(token, { type: 'bearer' })
            .send({
                title: 'JavaScript Gym',
                description: 'Somo description',
                phone: '1199999999',
                latitude: -3.539089,
                longitude: -40.456549,
            })

        await request(app.server)
            .post('/gyms')
            .auth(token, { type: 'bearer' })
            .send({
                title: 'TypeScript Gym',
                description: 'Somo description',
                phone: '1199999999',
                latitude: -3.5220286,
                longitude: -40.3513079,
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .auth(token, { type: 'bearer' })
            .query({
                latitude: -3.539089,
                longitude: -40.456549,
            })

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym'
            })
        ])
    })
})
