import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, } from "vitest";

describe("Profile (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get user informations', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server)
            .get('/me')
            .auth(token, { type: 'bearer' })

        expect(response.statusCode).toEqual(200)
        expect(response.body.user).toEqual(expect.objectContaining({
            email: 'johndoe@example.com'
        }))
    })
})
