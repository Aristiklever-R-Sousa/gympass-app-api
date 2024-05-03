import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export async function registerUseCase({
    name, email, password
}: RegisterUseCaseRequest) {
    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (userWithSameEmail) {
        throw new Error();
    }

    const password_hash = await hash(password, 6);

    const prismaUsersRepository = new PrismaUsersRepository()

    const userCreated = await prismaUsersRepository.create({
        name, email, password_hash
    })

    return userCreated
}
