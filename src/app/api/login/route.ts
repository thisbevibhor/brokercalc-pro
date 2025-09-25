import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // later set a real secret in .env

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
		}

		// Find user by email
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
		}

		// Compare password
		const passwordMatch = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatch) {
			return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
		}

		// Generate JWT
		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: "1h",
		});

		return NextResponse.json({ message: "Login successful", token });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
