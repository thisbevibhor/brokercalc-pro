import { useState, useCallback, useEffect } from "react";

interface Stock {
	symbol: string;
	exchange: string;
	name: string;
}

interface StockSymbolInputProps {
	value: string;
	onChange: (symbol: string) => void;
	onBlur?: () => void;
	className?: string;
}

export default function StockSymbolInput({ value, onChange, onBlur, className = "" }: StockSymbolInputProps) {
	const [searchTerm, setSearchTerm] = useState(value);
	const [suggestions, setSuggestions] = useState<Stock[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [loading, setLoading] = useState(false);

	const fetchSuggestions = useCallback(async (query: string) => {
		if (!query) {
			setSuggestions([]);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(`/api/symbols?q=${encodeURIComponent(query)}`);
			const data = await response.json();
			setSuggestions(data);
		} catch (error) {
			console.error("Failed to fetch suggestions:", error);
			setSuggestions([]);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		const debounceTimeout = setTimeout(() => {
			fetchSuggestions(searchTerm);
		}, 300);

		return () => clearTimeout(debounceTimeout);
	}, [searchTerm, fetchSuggestions]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toUpperCase();
		setSearchTerm(value);
		setShowSuggestions(true);
	};

	const handleSuggestionClick = (symbol: string) => {
		setSearchTerm(symbol);
		onChange(symbol);
		setShowSuggestions(false);
	};

	const handleBlur = () => {
		// Delay hiding suggestions to allow click events to register
		setTimeout(() => {
			setShowSuggestions(false);
			onBlur?.();
		}, 200);
	};

	return (
		<div className="relative w-full">
			<input
				type="text"
				value={searchTerm}
				onChange={handleInputChange}
				onBlur={handleBlur}
				onFocus={() => setShowSuggestions(true)}
				className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
				placeholder="Enter stock symbol (e.g., RELIANCE)"
			/>
			{showSuggestions && (searchTerm || loading) && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
					{loading ? (
						<div className="p-2 text-gray-500">Loading...</div>
					) : suggestions.length > 0 ? (
						suggestions.map((stock) => (
							<div key={stock.symbol} className="p-2 hover:bg-gray-100 cursor-pointer" onMouseDown={() => handleSuggestionClick(stock.symbol)}>
								<div className="font-medium">{stock.symbol}</div>
								<div className="text-sm text-gray-500">{stock.name}</div>
							</div>
						))
					) : searchTerm ? (
						<div className="p-2 text-gray-500">No matching symbols found</div>
					) : null}
				</div>
			)}
		</div>
	);
}
