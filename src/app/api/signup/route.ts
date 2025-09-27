import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signupSchema } from "@/utils/validation";
import { handleApiError } from "@/utils/error-handler";
import { ApiError } from "@/utils/error-handler";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		// 1. Validate input
		const body = await req.json();
		const validatedData = signupSchema.parse(body);
		const { email, password } = validatedData;

		// 2. Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
			select: { id: true }, // Only fetch id for efficiency
		});

		if (existingUser) {
			throw new ApiError(400, "User already exists");
		}

		// 3. Hash password with strong salt rounds
		const hashedPassword = await bcrypt.hash(password, 12);

		// 4. Create user
		const newUser = await prisma.user.create({
			data: {
				email,
				passwordHash: hashedPassword,
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
			},
		});

		// 5. Respond (exclude sensitive data)
		return NextResponse.json(
			{
				message: "User created successfully",
				user: {
					id: newUser.id,
					email: newUser.email,
					createdAt: newUser.createdAt,
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		return handleApiError(error);
	}
}
