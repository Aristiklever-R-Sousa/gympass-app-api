// import { expect, test } from "vitest";

// test('testing', () => {
//     expect(1 + 1).toEqual(2)
// })


import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, } from "vitest";

describe("Refresh Token (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to refresh a token', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'Jhon Doe',
                email: 'johndoe@example.com',
                password: '123456',
            })

        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: 'johndoe@example.com',
                password: '123456',
            })

        const cookies = authResponse.get('Set-Cookie') || []

        const response = await request(app.server)
            .patch('/token/refresh')
            .set('Cookie', cookies)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ])
    })
})
