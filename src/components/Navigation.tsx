"use client";

import Link from "next/link";
import styled from "styled-components";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

const Nav = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 2rem;
	background-color: ${({ theme }) => theme.background};
	border-bottom: 1px solid ${({ theme }) => theme.border};
	position: sticky;
	top: 0;
	z-index: 10;
	backdrop-filter: blur(10px);
`;

const NavGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;
`;

const NavLinks = styled.div`
	display: flex;
	gap: 1.5rem;
	align-items: center;
`;

const StyledLink = styled(Link)`
	color: ${({ theme }) => theme.text.primary};
	text-decoration: none;
	font-weight: 500;
	transition: all 0.2s ease;
	padding: 0.5rem 0.75rem;
	border-radius: 0.375rem;

	&:hover {
		color: ${({ theme }) => theme.primary};
		background: ${({ theme }) => theme.secondary};
	}
`;

const Logo = styled(Link)`
	color: ${({ theme }) => theme.primary};
	font-size: 1.25rem;
	font-weight: 700;
	text-decoration: none;
	transition: color 0.2s ease;

	&:hover {
		color: ${({ theme }) => theme.primaryHover};
	}
`;

const StyledButton = styled(Link)`
	background: ${({ theme }) => theme.primary};
	color: ${({ theme }) => theme.text.inverse};
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	font-weight: 500;
	transition: all 0.2s ease;

	&:hover {
		background: ${({ theme }) => theme.primaryHover};
	}
`;

const ThemeToggle = styled.button`
	background: ${({ theme }) => theme.secondary};
	border: 1px solid ${({ theme }) => theme.border};
	color: ${({ theme }) => theme.text.primary};
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	gap: 0.5rem;

	&:hover {
		background: ${({ theme }) => theme.secondaryHover};
	}
`;

export default function Navigation() {
	const { theme, toggleTheme } = useTheme();
	const { isAuthenticated, logout } = useAuth({ requireAuth: false });

	return (
		<Nav>
			<NavGroup>
				<Logo href="/">BrokerCalc Pro</Logo>
				<NavLinks>
					{isAuthenticated && (
						<>
							<StyledLink href="/dashboard">Dashboard</StyledLink>
							<StyledLink href="/orders">Orders</StyledLink>
							<StyledLink href="/calculations">Calculations</StyledLink>
						</>
					)}
				</NavLinks>
			</NavGroup>
			<NavGroup>
				<NavLinks>
					{!isAuthenticated ? (
						<>
							<StyledLink href="/login">Sign In</StyledLink>
							<StyledButton href="/signup">Get Started</StyledButton>
						</>
					) : (
						<StyledLink href="#" onClick={() => logout()}>
							Logout
						</StyledLink>
					)}
				</NavLinks>
				<ThemeToggle onClick={toggleTheme} type="button" aria-label="Toggle theme">
					{theme === "light" ? "🌙" : "☀️"}
				</ThemeToggle>
			</NavGroup>
		</Nav>
	);
}
