import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class ApiError extends Error {
	constructor(public statusCode: number, message: string) {
		super(message);
		this.name = "ApiError";
	}
}

export const handleApiError = (error: unknown) => {
	console.error(error);

	if (error instanceof ApiError) {
		return NextResponse.json({ error: error.message }, { status: error.statusCode });
	}

	if (error instanceof ZodError) {
		return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
	}

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		// Handle specific Prisma errors
		switch (error.code) {
			case "P2002":
				return NextResponse.json({ error: "Unique constraint violation" }, { status: 400 });
			case "P2025":
				return NextResponse.json({ error: "Record not found" }, { status: 404 });
			default:
				return NextResponse.json({ error: "Database error", code: error.code }, { status: 400 });
		}
	}

	return NextResponse.json(
		{
			error: "Internal server error",
			message: process.env.NODE_ENV === "development" ? error.toString() : undefined,
		},
		{ status: 500 }
	);
};
