"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";

const Hero = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: calc(100vh - 8rem);
	text-align: center;
	padding: 2rem;
`;

const Title = styled.h1`
	font-size: 3.5rem;
	font-weight: 800;
	margin-bottom: 1.5rem;
	background: linear-gradient(to right, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryHover});
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;
`;

const Subtitle = styled.p`
	font-size: 1.25rem;
	color: ${({ theme }) => theme.text.secondary};
	max-width: 600px;
	margin: 0 auto 2rem;
	line-height: 1.6;
`;

const ButtonGroup = styled.div`
	display: flex;
	gap: 1rem;
	margin-top: 2rem;
`;

const PrimaryButton = styled(Link)`
	background: ${({ theme }) => theme.primary};
	color: ${({ theme }) => theme.text.inverse};
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	font-weight: 500;
	transition: all 0.2s ease;

	&:hover {
		background: ${({ theme }) => theme.primaryHover};
		transform: translateY(-1px);
	}
`;

const SecondaryButton = styled(Link)`
	background: ${({ theme }) => theme.secondary};
	color: ${({ theme }) => theme.text.primary};
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	font-weight: 500;
	transition: all 0.2s ease;
	border: 1px solid ${({ theme }) => theme.border};

	&:hover {
		background: ${({ theme }) => theme.secondaryHover};
		transform: translateY(-1px);
	}
`;

const Features = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 2rem;
	margin-top: 4rem;
	width: 100%;
	max-width: 1200px;
`;

const FeatureCard = styled.div`
	background: ${({ theme }) => theme.background};
	border: 1px solid ${({ theme }) => theme.border};
	padding: 1.5rem;
	border-radius: 1rem;
	transition: all 0.2s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	h3 {
		color: ${({ theme }) => theme.text.primary};
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	p {
		color: ${({ theme }) => theme.text.secondary};
		line-height: 1.6;
	}
`;

export default function Home() {
	const { isAuthenticated } = useAuth({ redirectTo: "/dashboard", requireAuth: false });
	const router = useRouter();

	if (isAuthenticated) {
		router.push("/dashboard");
		return null;
	}

	return (
		<Hero>
			<Title>Brokerage Calculator for Indian Markets</Title>
			<Subtitle>Calculate brokerage charges, taxes, and P&L across multiple brokers. Track your trades and make informed decisions.</Subtitle>
			<ButtonGroup>
				<PrimaryButton href="/signup">Get Started</PrimaryButton>
				<SecondaryButton href="/login">Sign In</SecondaryButton>
			</ButtonGroup>
			<Features>
				<FeatureCard>
					<h3>Multiple Brokers</h3>
					<p>Support for Zerodha and Groww with accurate brokerage calculations</p>
				</FeatureCard>
				<FeatureCard>
					<h3>Detailed Breakdown</h3>
					<p>See detailed charges including STT, GST, stamp duty, and more</p>
				</FeatureCard>
				<FeatureCard>
					<h3>P&L Tracking</h3>
					<p>Track your trades and analyze your performance in real-time</p>
				</FeatureCard>
			</Features>
		</Hero>
	);
}
