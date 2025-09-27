"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "@/lib/registry";
import { lightTheme, darkTheme } from "@/theme/theme";

type ThemeContextType = {
	theme: "light" | "dark";
	toggleTheme: () => void;
	isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Add preload class to prevent transition flashing
		document.body.classList.add("preload");
		
		// On mount, read the theme from localStorage or system preference
		const storedTheme = localStorage.getItem("theme");
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		const initialTheme = (storedTheme as "light" | "dark") || systemTheme;
		
		setTheme(initialTheme);
		// Apply theme to document immediately to prevent flash
		document.documentElement.classList.toggle("dark", initialTheme === "dark");
		document.documentElement.style.colorScheme = initialTheme;
		setIsLoading(false);
		
		// Remove preload class after a small delay to allow styles to apply
		setTimeout(() => {
			document.body.classList.remove("preload");
		}, 100);
		
		// Listen for system theme changes
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem("theme")) {
				const newTheme = e.matches ? "dark" : "light";
				setTheme(newTheme);
				document.documentElement.classList.toggle("dark", newTheme === "dark");
				document.documentElement.style.colorScheme = newTheme;
			}
		};
		
		mediaQuery.addEventListener("change", handleSystemThemeChange);
		return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
		document.documentElement.style.colorScheme = newTheme;
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
			<StyledComponentsRegistry>
				<ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>{children}</ThemeProvider>
			</StyledComponentsRegistry>
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
