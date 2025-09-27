import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ApiError } from "@/utils/error-handler";

export interface AuthRequest extends Request {
	user?: {
		userId: string;
		email: string;
	};
}

export async function authenticateRequest(req: AuthRequest) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		throw new ApiError(401, "Unauthorized");
	}

	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET environment variable is not set");
	}

	const token = authHeader.split(" ")[1].trim();
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

		if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
			throw new ApiError(401, "Invalid token payload");
		}

		req.user = {
			userId: decoded.userId as string,
			email: decoded.email as string,
		};
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(401, "Invalid token");
		}
		throw error;
	}
}
