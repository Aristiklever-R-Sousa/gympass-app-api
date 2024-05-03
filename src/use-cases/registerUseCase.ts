import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

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

    return await prisma.user.create({
        data: {
            name,
            email,
            password_hash
        }
    })
}
