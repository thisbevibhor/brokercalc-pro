import { NextResponse } from "next/server";

// This is a sample of stock symbols. In production, you would fetch from a complete database or external API
const STOCK_SYMBOLS = [
	{ symbol: "RELIANCE", exchange: "NSE", name: "Reliance Industries Ltd." },
	{ symbol: "TCS", exchange: "NSE", name: "Tata Consultancy Services Ltd." },
	{ symbol: "HDFCBANK", exchange: "NSE", name: "HDFC Bank Ltd." },
	{ symbol: "INFY", exchange: "NSE", name: "Infosys Ltd." },
	{ symbol: "ICICIBANK", exchange: "NSE", name: "ICICI Bank Ltd." },
	// Add more symbols as needed
];

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const query = searchParams.get("q")?.toUpperCase() || "";

		if (!query) {
			return NextResponse.json(STOCK_SYMBOLS);
		}

		const filteredSymbols = STOCK_SYMBOLS.filter((stock) => stock.symbol.includes(query) || stock.name.toUpperCase().includes(query));

		return NextResponse.json(filteredSymbols);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Failed to fetch stock symbols" }, { status: 500 });
	}
}
