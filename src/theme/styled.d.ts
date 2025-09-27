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
		error: string;
		errorHover: string;
		text: {
			primary: string;
			secondary: string;
			inverse: string;
		};
	}
}
