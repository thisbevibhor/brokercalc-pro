import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/utils/validation";
import { handleApiError } from "@/utils/error-handler";
import { ApiError } from "@/utils/error-handler";

const prisma = new PrismaClient();

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is not set");
}

export async function POST(req: Request) {
	try {
		const body = await req.json();

		// Validate input
		const validatedData = loginSchema.parse(body);
		const { email, password } = validatedData;

		// Find user by email
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new ApiError(401, "Invalid email or password");
		}

		// Compare password
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatch) {
			throw new ApiError(401, "Invalid email or password");
		}

		// Generate JWT
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN || "1h",
			}
		);

		return NextResponse.json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				email: user.email,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}
