import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchItems } from "../../redux/song/reducer";

export const types = {
  ALL: "All",
  ARTISTS: "Artists",
  PLAYLISTS: "Playlists",
  SONGS: "Songs",
  ALBUMS: "Albums",
  PODCASTS_SHOWS: "Podcasts & Shows",
  PROFILES: "Profiles",
};

const SearchContext = React.createContext();

const Search = ({ children }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState(types.ALL);
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.song);

  React.useEffect(() => {
    if (searchQuery.trim() && searchCategory) {
      dispatch(searchItems({ q: searchQuery, category: searchCategory }));
    }
  }, [searchQuery, searchCategory, dispatch]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchCategory,
        setSearchCategory,
        results,
        loading,
        error,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => React.useContext(SearchContext);
export default Search;
