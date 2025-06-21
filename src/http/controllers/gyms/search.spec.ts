import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, } from "vitest";

describe("Search Gyms (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .auth(token, { type: 'bearer' })
            .send({
                title: 'JavaScript Gym',
                description: 'Somo description',
                phone: '1199999999',
                latitude: -3.5220479,
                longitude: -40.3502656,
            })

        await request(app.server)
            .post('/gyms')
            .auth(token, { type: 'bearer' })
            .send({
                title: 'TypeScript Gym',
                description: 'Somo description',
                phone: '1199999999',
                latitude: -3.5220479,
                longitude: -40.3502656,
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .auth(token, { type: 'bearer' })
            .query({
                q: 'Java',
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
