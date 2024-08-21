import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { SearchGymsUseCase } from "../search-gyms"

export function makeSearchGymsUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const sut = new SearchGymsUseCase(gymRepository)

  return sut
}
