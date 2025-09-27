"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "@/lib/registry";
import { lightTheme, darkTheme } from "@/theme/theme";

type ThemeContextType = {
	theme: "light" | "dark";
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		// On mount, read the theme from localStorage or system preference
		const storedTheme = localStorage.getItem("theme");
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		const initialTheme = storedTheme || systemTheme;
		setTheme(initialTheme as "light" | "dark");
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
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
