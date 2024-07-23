import { Gym, Prisma, } from "@prisma/client";
import { GymsRepository } from "../gyms-repository";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository {
    public gyms: Gym[] = []

    async findById(id: string) {
        const gym = this.gyms.find((gym) => gym.id === id)

        if (!gym) {
            return null
        }

        return gym
    }

    async create(data: Prisma.GymCreateInput) {

        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            longitude: new Prisma.Decimal(data.longitude.toString()),
            latitude: new Prisma.Decimal(data.latitude.toString()),
            created_at: new Date
        }

        this.gyms.push(gym)

        return gym
    }
}