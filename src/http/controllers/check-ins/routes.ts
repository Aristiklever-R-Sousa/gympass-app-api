import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { create } from "./create";
import { validate } from "./validate";
import { metrics } from "./metrics";
import { history } from "./history";

export async function gymRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/check-ins/history', history)
    app.post('/check-ins/metrics', metrics)

    app.post('/gyms/:gymId/check-ins', create)
    app.patch('/check-ins/:checkInId/validate', validate)

}
