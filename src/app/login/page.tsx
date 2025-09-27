"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${({ theme }) => theme.background};
`;

const FormContainer = styled.div`
	max-width: 28rem;
	width: 100%;
	padding: 2rem;
	background: ${({ theme }) => theme.background};
	border: 1px solid ${({ theme }) => theme.border};
	border-radius: 1rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
	margin-top: 1.5rem;
	font-size: 2rem;
	font-weight: 800;
	color: ${({ theme }) => theme.text.primary};
	text-align: center;
`;

const Subtitle = styled.p`
	margin-top: 0.5rem;
	font-size: 0.875rem;
	color: ${({ theme }) => theme.text.secondary};
	text-align: center;
`;

const StyledLink = styled(Link)`
	color: ${({ theme }) => theme.primary};
	font-weight: 500;
	transition: color 0.2s ease;

	&:hover {
		color: ${({ theme }) => theme.primaryHover};
	}
`;

const Form = styled.form`
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`;

const ErrorMessage = styled.div`
	padding: 1rem;
	background: #fee2e2;
	color: #991b1b;
	border-radius: 0.5rem;
	font-size: 0.875rem;
`;

const Input = styled.input`
	width: 100%;
	padding: 0.75rem 1rem;
	background: ${({ theme }) => theme.secondary};
	border: 1px solid ${({ theme }) => theme.border};
	border-radius: 0.5rem;
	color: ${({ theme }) => theme.text.primary};
	font-size: 1rem;
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		border-color: ${({ theme }) => theme.primary};
		box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
	}

	&::placeholder {
		color: ${({ theme }) => theme.text.secondary};
	}
`;

const SubmitButton = styled.button`
	width: 100%;
	padding: 0.75rem 1.5rem;
	background: ${({ theme }) => theme.primary};
	color: ${({ theme }) => theme.text.inverse};
	border: none;
	border-radius: 0.5rem;
	font-size: 1rem;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background: ${({ theme }) => theme.primaryHover};
	}

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
`;

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to login");
			}

			// Store the token
			localStorage.setItem("token", data.token);

			// Redirect to dashboard
			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
				<div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
					<p className="mt-2 text-sm text-gray-600">
						Or{" "}
						<Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
							create a new account
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{error && (
						<div className="rounded-md bg-red-50 p-4">
							<div className="text-sm text-red-700">{error}</div>
						</div>
					)}

					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing in..." : "Sign in"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
