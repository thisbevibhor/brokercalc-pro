"use client";

import { useEffect, useState } from "react";

export function useTheme() {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		// On mount, read the theme from localStorage or system preference
		const storedTheme = localStorage.getItem("theme");
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		const initialTheme = storedTheme || systemTheme;

		setTheme(initialTheme as "light" | "dark");
		document.documentElement.classList.toggle("dark", initialTheme === "dark");
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	return { theme, toggleTheme };
}
