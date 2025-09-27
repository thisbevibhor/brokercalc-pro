import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		background: string;
		foreground: string;
		primary: string;
		primaryHover: string;
		secondary: string;
		secondaryHover: string;
		border: string;
		success: string;
		successHover: string;
		successBackground: string;
		error: string;
		errorHover: string;
		errorBackground: string;
		text: {
			primary: string;
			secondary: string;
			inverse: string;
			success: string;
			error: string;
		};
	}
}
