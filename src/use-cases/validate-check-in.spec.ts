import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidateError } from "./errors/late-check-in-validate-error";

let checkInsRepository: CheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository,)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate the check in', async () => {
        const createdCheckin = await checkInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-01',
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckin.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {

        await expect(() =>
            sut.execute({
                checkInId: 'inexistent',
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)

    })

    it('should not be able to validate an check-in after 20min', async () => {
        vi.setSystemTime(new Date(2024, 6, 23, 21, 0, 0))

        const createdCheckin = await checkInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-01',
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(() =>
            sut.execute({
                checkInId: createdCheckin.id,
            })
        ).rejects.toBeInstanceOf(LateCheckInValidateError)

    })

})
