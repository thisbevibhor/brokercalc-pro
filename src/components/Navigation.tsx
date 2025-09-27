"use client";

import { useRouter } from "next/navigation";

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
	return (
		<a href={href} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
			{children}
		</a>
	);
}

export default function Navigation() {
	const router = useRouter();

	const handleSignOut = () => {
		localStorage.removeItem("token");
		router.push("/login");
	};

	return (
		<nav className="bg-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<span className="text-white font-bold text-xl">BrokerCalc Pro</span>
						</div>
						<div className="hidden md:block">
							<div className="ml-10 flex items-baseline space-x-4">
								<NavLink href="/dashboard">Dashboard</NavLink>
								<NavLink href="/orders">Orders</NavLink>
								<NavLink href="/calculations">Calculations</NavLink>
							</div>
						</div>
					</div>
					<div className="hidden md:block">
						<div className="ml-4 flex items-center md:ml-6">
							<button type="button" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium" onClick={handleSignOut}>
								Sign out
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
