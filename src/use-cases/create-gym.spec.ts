import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { CreateGymUseCase } from "./create-gym"
import { describe, beforeEach, it, expect } from "vitest"
import { GymsRepository } from "@/repositories/gyms-repository"

let gymsRepository: GymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create a gym', async () => {

        const { gym } = await sut.execute({
            title: 'John Doe Academy',
            description: null,
            phone: null,
            latitude: -3.5220479,
            longitude: -40.3502656,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})
