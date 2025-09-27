import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseAuthOptions {
	redirectTo?: string;
	requireAuth?: boolean;
}

export function useAuth({ redirectTo, requireAuth = true }: UseAuthOptions = {}) {
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const isAuthed = !!token;
		setIsAuthenticated(isAuthed);

		if (requireAuth && !isAuthed && redirectTo) {
			router.push(redirectTo);
		} else if (!requireAuth && isAuthed && redirectTo) {
			router.push(redirectTo);
		}

		setLoading(false);
	}, [requireAuth, redirectTo, router]);

	const logout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		router.push("/login");
	};

	return { isAuthenticated, loading, logout };
}

export function getAuthHeaders() {
	const token = localStorage.getItem("token");
	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
}
