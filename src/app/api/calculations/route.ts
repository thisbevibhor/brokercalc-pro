import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
	try {
		// 1. Authenticate user
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

		// 2. Parse order IDs from request body
		const body = await req.json();
		const { orderIds } = body;
		if (!orderIds || !Array.isArray(orderIds)) {
			return NextResponse.json({ error: "orderIds must be an array" }, { status: 400 });
		}

		// 3. Fetch orders from DB
		const orders = await prisma.order.findMany({
			where: {
				id: { in: orderIds },
				userId,
			},
		});

		if (orders.length === 0) {
			return NextResponse.json({ error: "No orders found for these IDs" }, { status: 404 });
		}

		// 4. Calculate totals
		let buyTotal = 0;
		let sellTotal = 0;
		let buyCharges = 0; // placeholder, we can add real logic later
		let sellCharges = 0;

		orders.forEach((order) => {
			if (order.type === "buy") buyTotal += order.qty * order.price;
			if (order.type === "sell") sellTotal += order.qty * order.price;
		});

		const grossPL = sellTotal - buyTotal;
		const netPL = grossPL - buyCharges - sellCharges;

		// 5. Save calculation
		const calculation = await prisma.calculation.create({
			data: {
				userId,
				// just array of strings
				orders: JSON.stringify(orders.map((o) => o.id)),
				buyTotal,
				sellTotal,
				buyCharges,
				sellCharges,
				grossPL,
				netPL,
			},
		});

		return NextResponse.json({ message: "Calculation created", calculation });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
