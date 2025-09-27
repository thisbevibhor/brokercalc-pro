import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const signupSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8)
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
		),
});

export const stockSymbolSchema = z
	.string()
	.min(1, "Stock symbol is required")
	.max(20, "Stock symbol too long")
	.regex(/^[A-Z0-9&]+$/, "Stock symbol must contain only uppercase letters, numbers, and &")
	.transform((val) => val.toUpperCase());

export const orderSchema = z.object({
	type: stockSymbolSchema,
	qty: z.number().positive("Quantity must be positive").max(1000000, "Quantity too large").int("Quantity must be a whole number"),
	price: z.number().positive("Price must be positive").max(1000000, "Price too large").multipleOf(0.05, "Price must be in multiples of 0.05"),
	tradeType: z.enum(["BUY", "SELL"]),
	brokerId: z.string().uuid().optional(),
	date: z.string().datetime().optional(),
	isIntraday: z.boolean().default(false),
});
export const calculationSchema = z.object({
	orderIds: z.array(z.string().uuid()).min(1),
});

export const brokerSchema = z.object({
	brokerName: z.enum(["Zerodha", "Groww"]),
	apiKey: z.string().min(1),
	apiSecret: z.string().min(1),
});

export type BrokerName = z.infer<typeof brokerSchema>["brokerName"];

interface BrokerageConfig {
	equityDeliveryBuy: number; // percentage
	equityDeliverySell: number; // percentage
	equityIntraday: number; // percentage
	dpCharges: number; // flat fee in INR
	sttCharges: number; // percentage
	transactionCharges: number; // percentage
	gst: number; // percentage
	stampDuty: number; // percentage
	sebiCharges: number; // percentage
}

export const BROKERAGE_CONFIGS: Record<BrokerName, BrokerageConfig> = {
	Zerodha: {
		equityDeliveryBuy: 0,
		equityDeliverySell: 0.1,
		equityIntraday: 0.03,
		dpCharges: 15.93,
		sttCharges: 0.1,
		transactionCharges: 0.00345,
		gst: 18,
		stampDuty: 0.015,
		sebiCharges: 0.0001,
	},
	Groww: {
		equityDeliveryBuy: 0,
		equityDeliverySell: 0.05,
		equityIntraday: 0.05,
		dpCharges: 15.93,
		sttCharges: 0.1,
		transactionCharges: 0.00345,
		gst: 18,
		stampDuty: 0.015,
		sebiCharges: 0.0001,
	},
};

export const paginationSchema = z.object({
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(10),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CalculationInput = z.infer<typeof calculationSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
