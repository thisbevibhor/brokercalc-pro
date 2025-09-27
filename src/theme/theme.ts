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
	error: "#DC2626",
	errorHover: "#B91C1C",
	text: {
		primary: "#171717",
		secondary: "#6B7280",
		inverse: "#FFFFFF",
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
	error: "#EF4444",
	errorHover: "#F87171",
	text: {
		primary: "#EDEDED",
		secondary: "#A1A1AA",
		inverse: "#171717",
	},
};
