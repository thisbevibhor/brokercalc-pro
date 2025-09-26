import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const token = authHeader.split(" ")[1].trim();
		let decoded: string | jwt.JwtPayload;
		try {
			decoded = jwt.verify(token, JWT_SECRET);
		} catch {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		if (typeof decoded === "string" || !("userId" in decoded)) {
			return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
		}

		const userId = decoded.userId as string;

		// Parse order data from request body
		const body = await req.json();
		const { brokerId: bodyBrokerId, type, qty, price, tradeType, date } = body;

		if (!type || !qty || !price || !tradeType) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Use brokerId from body if provided, otherwise fetch first broker for this user
		let brokerId = bodyBrokerId;
		if (!brokerId) {
			const broker = await prisma.brokerAccount.findFirst({
				where: { userId },
			});
			if (!broker) {
				return NextResponse.json({ error: "No broker found for this user" }, { status: 400 });
			}
			brokerId = broker.id;
		}

		const order = await prisma.order.create({
			data: {
				userId,
				brokerId,
				type,
				qty,
				price,
				tradeType,
				date: date ? new Date(date) : new Date(),
			},
		});

		return NextResponse.json({ message: "Order created successfully", order });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
