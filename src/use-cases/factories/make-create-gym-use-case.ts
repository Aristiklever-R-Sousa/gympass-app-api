import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "../create-gym";

export function makeCheckInUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const sut = new CreateGymUseCase(gymsRepository)

  return sut

}
