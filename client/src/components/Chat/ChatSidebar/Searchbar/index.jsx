import { Search, X } from "lucide-react";
import { useChat } from "../../../../contexts/Chat";
import { useEffect } from "react";
import { useUser } from "../../../../contexts/User";

const SearchBar = () => {
	const { searchUserInput, setSearchUserInput } = useChat();
	const { queryUser } = useUser();

	// When user finds other users -> query users from database
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchUserInput.trim()) {
				queryUser(searchUserInput);
			}
		}, 500);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [queryUser, searchUserInput]);

	const handleSearch = (e) => {
		setSearchUserInput(e.target.value);
	};

	const handleClearSearch = () => {
		setSearchUserInput("");
	};

	return (
		<div className='p-4 border-b border-gray-800'>
			<div className='bg-gray-800 rounded-full flex items-center px-4 py-2'>
				<Search size={16} className='text-gray-400' />
				<input
					type='text'
					value={searchUserInput}
					onChange={handleSearch}
					placeholder='Search for users...'
					className='bg-transparent border-none outline-none text-white w-full ml-2'
				/>
				{searchUserInput && (
					<button
						onClick={handleClearSearch}
						className='text-gray-400 cursor-pointer hover:bg-black/20 p-1 rounded-full'>
						<X size={16} />
					</button>
				)}
			</div>
		</div>
	);
};

export default SearchBar;
