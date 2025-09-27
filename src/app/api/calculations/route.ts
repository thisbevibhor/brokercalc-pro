import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculationSchema, paginationSchema, BrokerName } from "@/utils/validation";
import { handleApiError } from "@/utils/error-handler";
import { ApiError } from "@/utils/error-handler";
import { authenticateRequest, AuthRequest } from "@/middleware/auth";
import { calculateBrokerage } from "@/utils/brokerage";

const prisma = new PrismaClient();

export async function POST(req: AuthRequest) {
	try {
		// 1. Authenticate user
		await authenticateRequest(req);
		const userId = req.user!.userId;

		// 2. Validate input
		const body = await req.json();
		const validatedData = calculationSchema.parse(body);
		const { orderIds } = validatedData;

		// 3. Fetch orders and verify ownership
		const orders = await prisma.order.findMany({
			where: {
				id: { in: orderIds },
				userId, // Ensure orders belong to user
			},
			include: {
				broker: {
					select: {
						brokerName: true,
					},
				},
			},
		});

		if (orders.length === 0) {
			throw new ApiError(404, "No orders found for these IDs");
		}

		if (orders.length !== orderIds.length) {
			throw new ApiError(403, "Some orders were not found or do not belong to you");
		}

		// 4. Calculate totals with proper type handling
		let buyTotal = 0;
		let sellTotal = 0;
		let buyCharges = 0;
		let sellCharges = 0;

		orders.forEach((order) => {
			const amount = order.qty * order.price;
			const brokerName = order.broker?.brokerName as BrokerName;

			if (!brokerName) {
				throw new ApiError(400, "Broker information missing for some orders");
			}

			const charges = calculateBrokerage({
				brokerName,
				price: order.price,
				quantity: order.qty,
				tradeType: order.tradeType,
				isIntraday: false, // For now, we'll assume all trades are delivery
			});

			if (order.tradeType === "BUY") {
				buyTotal += amount;
				buyCharges += charges.total;
			} else {
				sellTotal += amount;
				sellCharges += charges.total;
			}
		});

		const grossPL = sellTotal - buyTotal;
		const netPL = grossPL - buyCharges - sellCharges;

		// 5. Save calculation with proper relations
		const calculation = await prisma.calculation.create({
			data: {
				userId,
				orders: {
					connect: orderIds.map((id) => ({ id })),
				},
				buyTotal,
				sellTotal,
				buyCharges,
				sellCharges,
				grossPL,
				netPL,
			},
			include: {
				orders: {
					include: {
						broker: {
							select: {
								brokerName: true,
							},
						},
					},
				},
			},
		});

		return NextResponse.json(
			{
				message: "Calculation created successfully",
				calculation,
			},
			{ status: 201 }
		);
	} catch (error) {
		return handleApiError(error);
	}
}

export async function GET(req: AuthRequest) {
	try {
		// 1. Authenticate user
		await authenticateRequest(req);
		const userId = req.user!.userId;

		// 2. Parse and validate pagination parameters
		const url = new URL(req.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");

		const validatedPagination = paginationSchema.parse({ page, limit });
		const skip = (validatedPagination.page - 1) * validatedPagination.limit;

		// 3. Fetch calculations with pagination
		const [calculations, total] = await Promise.all([
			prisma.calculation.findMany({
				where: { userId },
				include: {
					orders: {
						include: {
							broker: {
								select: {
									brokerName: true,
								},
							},
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: validatedPagination.limit,
			}),
			prisma.calculation.count({ where: { userId } }),
		]);

		return NextResponse.json({
			calculations,
			pagination: {
				total,
				page: validatedPagination.page,
				limit: validatedPagination.limit,
				totalPages: Math.ceil(total / validatedPagination.limit),
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}

// Helper function for calculating charges
function calculateCharges(amount: number): number {
	// Implement your charge calculation logic here
	// This is a placeholder that calculates 0.1% charges
	return amount * 0.001;
}
