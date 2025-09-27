import { BrokerName, BROKERAGE_CONFIGS } from "./validation";

interface BrokerageCalculationInput {
	brokerName: BrokerName;
	price: number;
	quantity: number;
	tradeType: "BUY" | "SELL";
	isIntraday?: boolean;
}

interface BrokerageBreakdown {
	brokerage: number;
	stt: number;
	transactionCharges: number;
	gst: number;
	sebiCharges: number;
	stampDuty: number;
	dpCharges: number;
	total: number;
}

export function calculateBrokerage({ brokerName, price, quantity, tradeType, isIntraday = false }: BrokerageCalculationInput): BrokerageBreakdown {
	const config = BROKERAGE_CONFIGS[brokerName];
	const turnover = price * quantity;

	// Calculate brokerage
	let brokerage = 0;
	if (isIntraday) {
		brokerage = (turnover * config.equityIntraday) / 100;
	} else {
		brokerage = tradeType === "SELL" ? (turnover * config.equityDeliverySell) / 100 : (turnover * config.equityDeliveryBuy) / 100;
	}

	// STT is charged on sell side for both delivery and intraday
	// For intraday, it's charged on sell side on turnover
	// For delivery, it's charged on sell side on turnover
	const stt = tradeType === "SELL" ? (turnover * config.sttCharges) / 100 : 0;

	// Exchange transaction charges
	const transactionCharges = (turnover * config.transactionCharges) / 100;

	// GST is charged on (brokerage + transaction charges)
	const gst = ((brokerage + transactionCharges) * config.gst) / 100;

	// SEBI charges
	const sebiCharges = (turnover * config.sebiCharges) / 100;

	// Stamp duty is charged only on buy side
	const stampDuty = tradeType === "BUY" ? (turnover * config.stampDuty) / 100 : 0;

	// DP charges are applicable only for delivery sell trades
	const dpCharges = !isIntraday && tradeType === "SELL" ? config.dpCharges : 0;

	// Calculate total charges
	const total = brokerage + stt + transactionCharges + gst + sebiCharges + stampDuty + dpCharges;

	return {
		brokerage: Number(brokerage.toFixed(2)),
		stt: Number(stt.toFixed(2)),
		transactionCharges: Number(transactionCharges.toFixed(2)),
		gst: Number(gst.toFixed(2)),
		sebiCharges: Number(sebiCharges.toFixed(2)),
		stampDuty: Number(stampDuty.toFixed(2)),
		dpCharges: Number(dpCharges.toFixed(2)),
		total: Number(total.toFixed(2)),
	};
}
