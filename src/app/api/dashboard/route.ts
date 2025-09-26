import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Trim token to remove spaces/newlines
		const token = authHeader.split(" ")[1].trim();

		let decoded: string | jwt.JwtPayload;
		try {
			decoded = jwt.verify(token, JWT_SECRET);
		} catch {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		// Ensure payload has userId
		if (typeof decoded === "string" || !("userId" in decoded)) {
			return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
		}

		const userId = decoded.userId as string;

		// Fetch calculations (empty for now)
		const calculations = await prisma.calculation.findMany({
			where: { userId },
		});

		return NextResponse.json({ message: "Dashboard data", calculations });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
