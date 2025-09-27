import type { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
	background: "#FFFFFF",
	foreground: "#171717",
	primary: "#2563EB",
	primaryHover: "#1D4ED8",
	secondary: "#F3F4F6",
	secondaryHover: "#E5E7EB",
	border: "#E5E7EB",
	success: "#059669",
	successHover: "#047857",
	successBackground: "#ECFDF5",
	error: "#DC2626",
	errorHover: "#B91C1C",
	errorBackground: "#FEF2F2",
	text: {
		primary: "#171717",
		secondary: "#6B7280",
		inverse: "#FFFFFF",
		success: "#065F46",
		error: "#991B1B",
	},
};

export const darkTheme: DefaultTheme = {
	background: "#0A0A0A",
	foreground: "#EDEDED",
	primary: "#3B82F6",
	primaryHover: "#60A5FA",
	secondary: "#27272A",
	secondaryHover: "#3F3F46",
	border: "#27272A",
	success: "#34D399",
	successHover: "#6EE7B7",
	successBackground: "#064E3B",
	error: "#EF4444",
	errorHover: "#F87171",
	errorBackground: "#7F1D1D",
	text: {
		primary: "#EDEDED",
		secondary: "#A1A1AA",
		inverse: "#171717",
		success: "#6EE7B7",
		error: "#FCA5A5",
	},
};
