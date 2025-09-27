import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { paginationSchema } from "@/utils/validation";
import { handleApiError } from "@/utils/error-handler";
import { authenticateRequest, AuthRequest } from "@/middleware/auth";

const prisma = new PrismaClient();

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

		// 3. Fetch dashboard data
		const [recentCalculations, totalCalculations, recentOrders, totalOrders, aggregatedStats] = await Promise.all([
			// Recent calculations
			prisma.calculation.findMany({
				where: { userId },
				orderBy: { createdAt: "desc" },
				take: validatedPagination.limit,
				skip,
				include: {
					orders: {
						include: {
							broker: {
								select: { brokerName: true },
							},
						},
					},
				},
			}),
			// Total calculations count
			prisma.calculation.count({
				where: { userId },
			}),
			// Recent orders
			prisma.order.findMany({
				where: { userId },
				orderBy: { date: "desc" },
				take: 5,
				include: {
					broker: {
						select: { brokerName: true },
					},
				},
			}),
			// Total orders count
			prisma.order.count({
				where: { userId },
			}),
			// Aggregated statistics
			prisma.calculation.aggregate({
				where: { userId },
				_sum: {
					grossPL: true,
					netPL: true,
					buyTotal: true,
					sellTotal: true,
					buyCharges: true,
					sellCharges: true,
				},
			}),
		]);

		// 4. Prepare response
		return NextResponse.json({
			recentCalculations,
			recentOrders,
			statistics: {
				totalOrders,
				totalCalculations,
				totalGrossPL: aggregatedStats._sum.grossPL || 0,
				totalNetPL: aggregatedStats._sum.netPL || 0,
				totalBuyAmount: aggregatedStats._sum.buyTotal || 0,
				totalSellAmount: aggregatedStats._sum.sellTotal || 0,
				totalCharges: (aggregatedStats._sum.buyCharges || 0) + (aggregatedStats._sum.sellCharges || 0),
			},
			pagination: {
				total: totalCalculations,
				page: validatedPagination.page,
				limit: validatedPagination.limit,
				totalPages: Math.ceil(totalCalculations / validatedPagination.limit),
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}
