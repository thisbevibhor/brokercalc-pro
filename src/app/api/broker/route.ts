import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { brokerSchema } from "@/utils/validation";
import { handleApiError } from "@/utils/error-handler";
import { ApiError } from "@/utils/error-handler";
import { authenticateRequest, AuthRequest } from "@/middleware/auth";

const prisma = new PrismaClient();

export async function POST(req: AuthRequest) {
	try {
		// 1. Authenticate request
		await authenticateRequest(req);
		const userId = req.user!.userId;

		// 2. Validate request body
		const body = await req.json();
		const validatedData = brokerSchema.parse(body);
		const { brokerName, apiKey, apiSecret } = validatedData;

		// 3. Check if broker already exists for user
		const existingBroker = await prisma.brokerAccount.findFirst({
			where: {
				userId,
				brokerName,
			},
		});

		if (existingBroker) {
			throw new ApiError(400, "Broker account already exists for this user");
		}

		// 4. Create broker account
		const brokerAccount = await prisma.brokerAccount.create({
			data: {
				userId,
				brokerName,
				apiKey,
				apiSecret,
			},
			select: {
				id: true,
				brokerName: true,
				connectedAt: true,
			},
		});

		return NextResponse.json(
			{
				message: "Broker account connected successfully",
				broker: brokerAccount,
			},
			{ status: 201 }
		);
	} catch (error) {
		return handleApiError(error);
	}
}

export async function GET(req: AuthRequest) {
	try {
		// 1. Authenticate request
		await authenticateRequest(req);
		const userId = req.user!.userId;

		// 2. Fetch all broker accounts for user
		const brokerAccounts = await prisma.brokerAccount.findMany({
			where: {
				userId,
			},
			select: {
				id: true,
				brokerName: true,
				connectedAt: true,
			},
		});

		return NextResponse.json({
			brokers: brokerAccounts,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
