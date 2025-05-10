import React, { useCallback, useState } from "react";
import { instance } from "../Axios";
import { apis } from "../../constants/apis";
import _ from "lodash";

const SearchContext = React.createContext();

const Search = ({ children }) => {
	const [searchResult, setSearchResult] = useState({
		songs: [],
		users: [],
		playlists: [],
	});
	const [loadingSearchResult, setLoadingSearchResult] = useState(false);
	const [searchInput, setSearchInput] = useState({});
	const [type, setType] = useState({});

	console.log("Search Input: ", searchInput);

	const handleSearch = useCallback(async () => {
		if (_.isEmpty(searchInput)) {
			setSearchResult({ songs: [], users: [], playlists: [] });
			return;
		}

		try {
			setLoadingSearchResult(true);
			const response = await instance.get(apis.songs.search(), {
				params: {
					query: searchInput,
					type: type.name || "All",
				},
			});
			console.log("Search resposne: ", response);
			if (response.status === 200) {
				setSearchResult({
					songs: response.data.songs || [],
					users: response.data.users || [],
					playlists: response.data.playlists || [],
				});
			} else {
				setSearchResult({ songs: [], users: [], playlists: [] });
			}
		} catch (error) {
			console.log("Search error: ", error);
			setSearchResult({ songs: [], users: [], playlists: [] });
		} finally {
			setLoadingSearchResult(false);
		}
	}, [searchInput, type]);

	return (
		<SearchContext.Provider
			value={{
				searchInput,
				setSearchInput,
				type,
				setType,
				handleSearch,
				searchResult,
				loadingSearchResult,
			}}>
			{children}
		</SearchContext.Provider>
	);
};

export const useSearch = () => React.useContext(SearchContext);
export default React.memo(Search);
