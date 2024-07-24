import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public checkIns: CheckIn[] = []

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameDate = this.checkIns.find(checkIn => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return checkIn.user_id === userId && isOnSameDate
        })

        if (!checkInOnSameDate) {
            return null
        }

        return checkInOnSameDate
    }

    async findById(id: string) {
        const checkIn = this.checkIns
            .find(checkIn => checkIn.id === id)

        if (!checkIn) {
            return null
        }

        return checkIn
    }

    async countByUserId(userId: string) {
        const checkInsCount = this.checkIns
            .filter(checkIn => checkIn.user_id === userId)
            .length

        return checkInsCount
    }

    async findManyByUserId(userId: string, page: number) {
        const perPage = 20;
        const endItemIndex = perPage * page;
        const startItemIndex = endItemIndex - perPage;

        const checkIns = this.checkIns
            .filter(checkIn => checkIn.user_id === userId)
            .slice(startItemIndex, endItemIndex)

        if (checkIns.length === 0) {
            return null
        }

        return checkIns
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        }

        this.checkIns.push(checkIn)

        return checkIn
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.checkIns.findIndex((checkInItem) => checkInItem.id === checkIn.id)

        if (checkInIndex >= 0) {
            this.checkIns[checkInIndex] = checkIn

        }

        return checkIn
    }

}
