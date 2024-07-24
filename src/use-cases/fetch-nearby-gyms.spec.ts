import { beforeEach, describe, expect, it } from "vitest";
import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymRepository: GymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymRepository)

    })

    it('should be able to fetch nearby gyms', async () => {
        await gymRepository.create({
            title: 'Ok Gym',
            description: null,
            phone: null,
            latitude: -3.6101782332433525,
            longitude: -40.351092279539166,
        })

        await gymRepository.create({
            title: 'Fail Gym',
            description: null,
            phone: null,
            latitude: - 3.6343982883877266,
            longitude: -40.35359989918493,
        })

        const { gyms } = await sut.execute({
            userLatitude: -3.5264544748998237,
            userLongitude: -40.34224071700431
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Ok Gym' })
        ])
    })

    // it('should be able to paginated nearby gyms results', async () => {
    //     for (let i = 1; i <= 22; i++) {
    //         await gymRepository.create({
    //             title: `Teste Sure ${i}`,
    //             description: null,
    //             phone: null,
    //             latitude: -3.5220479,
    //             longitude: -40.3502656,
    //         })
    //     }

    //     const { gyms } = await sut.execute({
    //         title: 'Teste Sure',
    //         page: 2
    //     })

    //     expect(gyms).toHaveLength(2)
    //     expect(gyms).toEqual([
    //         expect.objectContaining({ title: 'Teste Sure 21' }),
    //         expect.objectContaining({ title: 'Teste Sure 22' }),
    //     ])
    // })

})
