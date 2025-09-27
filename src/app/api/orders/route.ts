import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { orderSchema } from "@/utils/validation";
import { handleApiError } from "@/utils/error-handler";
import { ApiError } from "@/utils/error-handler";
import { authenticateRequest, AuthRequest } from "@/middleware/auth";

const prisma = new PrismaClient();

export async function POST(req: AuthRequest) {
	try {
		// Authenticate request
		await authenticateRequest(req);
		const userId = req.user!.userId;

		// Validate request body
		const body = await req.json();
		const validatedData = orderSchema.parse(body);
		const { brokerId: bodyBrokerId, type, qty, price, tradeType, date } = validatedData;

		// Get or validate broker
		let brokerId = bodyBrokerId;
		if (!brokerId) {
			const broker = await prisma.brokerAccount.findFirst({
				where: { userId },
			});
			if (!broker) {
				throw new ApiError(400, "No broker found for this user");
			}
			brokerId = broker.id;
		} else {
			// Verify broker belongs to user if provided
			const broker = await prisma.brokerAccount.findFirst({
				where: { id: brokerId, userId },
			});
			if (!broker) {
				throw new ApiError(403, "Unauthorized access to broker account");
			}
		}

		// Create order
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
			include: {
				broker: {
					select: {
						brokerName: true,
					},
				},
			},
		});

		return NextResponse.json(
			{
				message: "Order created successfully",
				order: {
					...order,
					broker: {
						brokerName: order.broker.brokerName,
					},
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		return handleApiError(error);
	}
}

export async function GET(req: AuthRequest) {
	try {
		await authenticateRequest(req);
		const userId = req.user!.userId;

		// Get query parameters for pagination
		const url = new URL(req.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");
		const skip = (page - 1) * limit;

		// Get orders with pagination
		const [orders, total] = await Promise.all([
			prisma.order.findMany({
				where: { userId },
				include: {
					broker: {
						select: {
							brokerName: true,
						},
					},
				},
				orderBy: { date: "desc" },
				skip,
				take: limit,
			}),
			prisma.order.count({ where: { userId } }),
		]);

		return NextResponse.json({
			orders,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}
