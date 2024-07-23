import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";
import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymRepository: GymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymRepository)

    })

    it('should be able to search gyms by title', async () => {
        await gymRepository.create({
            title: 'Academy123',
            description: null,
            phone: null,
            latitude: -3.5220479,
            longitude: -40.3502656,
        })

        await gymRepository.create({
            title: 'ABCDemy',
            description: null,
            phone: null,
            latitude: -3.5220479,
            longitude: -40.3502656,
        })

        await gymRepository.create({
            title: 'Teste Sure',
            description: null,
            phone: null,
            latitude: -3.5220479,
            longitude: -40.3502656,
        })

        const { gyms } = await sut.execute({
            title: 'Aca',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Academy123' }),
        ])
    })

    it('should be able to paginated search gyms results', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymRepository.create({
                title: `Teste Sure ${i}`,
                description: null,
                phone: null,
                latitude: -3.5220479,
                longitude: -40.3502656,
            })
        }

        const { gyms } = await sut.execute({
            title: 'Teste Sure',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Teste Sure 21' }),
            expect.objectContaining({ title: 'Teste Sure 22' }),
        ])
    })

})
