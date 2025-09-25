import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password } = body;

		// 1. Basic validation
		if (!email || !password) {
			return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
		}

		// 2. Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return NextResponse.json({ error: "User already exists" }, { status: 400 });
		}

		// 3. Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// 4. Create user
		const newUser = await prisma.user.create({
			data: {
				email,
				passwordHash: hashedPassword,
			},
		});

		// 5. Respond
		return NextResponse.json({ message: "User created successfully", userId: newUser.id }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
