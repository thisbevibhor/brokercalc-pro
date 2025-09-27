"use client";

import styled from "styled-components";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";

const MainContainer = styled.main`
	min-height: calc(100vh - 4rem);
	background-color: ${({ theme }) => theme.background};
	color: ${({ theme }) => theme.text.primary};
	padding: 2rem;
`;

export function ClientLayout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<Navigation />
			<MainContainer>{children}</MainContainer>
		</Providers>
	);
}
