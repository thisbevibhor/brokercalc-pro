"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getAuthHeaders } from "@/hooks/useAuth";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1rem;
`;

const Header = styled.div`
	padding-bottom: 1rem;
	border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h1`
	font-size: 1.5rem;
	font-weight: 600;
	color: ${({ theme }) => theme.text.primary};
	margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
	color: ${({ theme }) => theme.text.secondary};
`;

const ActionGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;

	@media (min-width: 768px) {
		grid-template-columns: 1fr 1fr;
	}
`;

const ActionButton = styled.button<{ variant?: "primary" | "success" }>`
	padding: 1rem;
	background: ${({ theme, variant }) => (variant === "success" ? theme.success : theme.primary)};
	color: ${({ theme }) => theme.text.inverse};
	border-radius: 0.5rem;
	font-weight: 500;
	transition: all 0.2s ease;

	&:hover {
		background: ${({ theme, variant }) => (variant === "success" ? theme.successHover : theme.primaryHover)};
		transform: translateY(-1px);
	}
`;

const Card = styled.div`
	background: ${({ theme }) => theme.background};
	border: 1px solid ${({ theme }) => theme.border};
	border-radius: 0.5rem;
	overflow: hidden;
`;

const CardHeader = styled.div`
	padding: 1rem;
	border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const CardTitle = styled.h2`
	font-size: 1.125rem;
	font-weight: 500;
	color: ${({ theme }) => theme.text.primary};
`;

const ListContainer = styled.div`
	divide-y: 1px solid ${({ theme }) => theme.border};
`;

const ListItem = styled.div`
	padding: 1rem;
	transition: background-color 0.2s ease;

	&:hover {
		background: ${({ theme }) => theme.secondary};
	}
`;

const ListItemHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const OrderType = styled.span<{ type: "BUY" | "SELL" }>`
	font-weight: 500;
	color: ${({ theme, type }) => (type === "BUY" ? theme.success : theme.error)};
`;

const Symbol = styled.span`
	margin-left: 0.5rem;
	color: ${({ theme }) => theme.text.primary};
`;

const Price = styled.span`
	margin-left: 0.5rem;
	color: ${({ theme }) => theme.text.secondary};
`;

const Date = styled.div`
	font-size: 0.875rem;
	color: ${({ theme }) => theme.text.secondary};
`;

const BrokerInfo = styled.div`
	font-size: 0.875rem;
	color: ${({ theme }) => theme.text.secondary};
	margin-top: 0.25rem;
`;

const Loading = styled.div`
	padding: 1rem;
	text-align: center;
	color: ${({ theme }) => theme.text.secondary};
`;

const EmptyState = styled(Loading)`
	color: ${({ theme }) => theme.text.secondary};
`;

const ProfitLoss = styled.span<{ value: number }>`
	font-weight: 500;
	color: ${({ theme, value }) => (value >= 0 ? theme.success : theme.error)};
`;

const PLDetails = styled.span`
	margin-left: 0.5rem;
	color: ${({ theme }) => theme.text.secondary};
`;

const Breakdown = styled.div`
	font-size: 0.875rem;
	color: ${({ theme }) => theme.text.secondary};
	margin-top: 0.25rem;
`;

interface Order {
	id: string;
	type: string; // Stock symbol
	qty: number;
	price: number;
	tradeType: "BUY" | "SELL";
	date: string;
	broker: {
		brokerName: string;
	};
}

interface Calculation {
	id: string;
	buyTotal: number;
	sellTotal: number;
	grossPL: number;
	netPL: number;
	createdAt: string;
}

export default function DashboardPage() {
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState<Order[]>([]);
	const [calculations, setCalculations] = useState<Calculation[]>([]);
	const { isAuthenticated } = useAuth({ redirectTo: "/login", requireAuth: true });
	const router = useRouter();

	useEffect(() => {
		async function fetchDashboardData() {
			try {
				const [ordersRes, calcRes] = await Promise.all([
					fetch("/api/orders?limit=5", {
						headers: getAuthHeaders(),
					}),
					fetch("/api/calculations?limit=5", {
						headers: getAuthHeaders(),
					}),
				]);

				if (!ordersRes.ok || !calcRes.ok) {
					throw new Error("Failed to fetch dashboard data");
				}

				const ordersData = await ordersRes.json();
				const calcData = await calcRes.json();

				setOrders(ordersData.orders);
				setCalculations(calcData.calculations);
			} catch (error) {
				console.error("Dashboard data fetch error:", error);
			} finally {
				setLoading(false);
			}
		}

		if (isAuthenticated) {
			fetchDashboardData();
		}
	}, [isAuthenticated]);

	if (!isAuthenticated) return null;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="border-b pb-4">
				<h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
				<p className="text-gray-500">Welcome back! Here's your trading overview.</p>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<button onClick={() => router.push("/orders/new")} className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					Add New Order
				</button>
				<button
					onClick={() => router.push("/calculations/new")}
					className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
				>
					Calculate P&L
				</button>
			</div>

			{/* Recent Orders */}
			<div className="bg-white rounded-lg shadow">
				<div className="p-4 border-b">
					<h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
				</div>
				<div className="divide-y">
					{loading ? (
						<div className="p-4 text-center text-gray-500">Loading...</div>
					) : orders.length > 0 ? (
						orders.map((order) => (
							<div key={order.id} className="p-4 hover:bg-gray-50">
								<div className="flex justify-between items-center">
									<div>
										<span className={`font-medium ${order.tradeType === "BUY" ? "text-green-600" : "text-red-600"}`}>{order.tradeType}</span>
										<span className="ml-2 text-gray-900">{order.type}</span>
										<span className="ml-2 text-gray-500">
											{order.qty} × ₹{order.price.toFixed(2)}
										</span>
									</div>
									<div className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
								</div>
								<div className="text-sm text-gray-500 mt-1">via {order.broker.brokerName}</div>
							</div>
						))
					) : (
						<div className="p-4 text-center text-gray-500">No orders yet</div>
					)}
				</div>
			</div>

			{/* Recent Calculations */}
			<div className="bg-white rounded-lg shadow">
				<div className="p-4 border-b">
					<h2 className="text-lg font-medium text-gray-900">Recent Calculations</h2>
				</div>
				<div className="divide-y">
					{loading ? (
						<div className="p-4 text-center text-gray-500">Loading...</div>
					) : calculations.length > 0 ? (
						calculations.map((calc) => (
							<div key={calc.id} className="p-4 hover:bg-gray-50">
								<div className="flex justify-between items-center">
									<div>
										<span className={`font-medium ${calc.netPL >= 0 ? "text-green-600" : "text-red-600"}`}>₹{calc.netPL.toFixed(2)}</span>
										<span className="ml-2 text-gray-500">(Gross: ₹{calc.grossPL.toFixed(2)})</span>
									</div>
									<div className="text-sm text-gray-500">{new Date(calc.createdAt).toLocaleDateString()}</div>
								</div>
								<div className="text-sm text-gray-500 mt-1">
									Buy: ₹{calc.buyTotal.toFixed(2)} | Sell: ₹{calc.sellTotal.toFixed(2)}
								</div>
							</div>
						))
					) : (
						<div className="p-4 text-center text-gray-500">No calculations yet</div>
					)}
				</div>
			</div>
		</div>
	);
}
