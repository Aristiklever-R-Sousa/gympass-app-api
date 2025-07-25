import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { GetUserProfileUseCase } from "../get-user-profile"

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const sut = new GetUserProfileUseCase(usersRepository)

  return sut
}
