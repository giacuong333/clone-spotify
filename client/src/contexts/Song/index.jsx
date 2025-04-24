import React, { useCallback, useEffect, useState } from "react";
import { apis } from "../../constants/apis";
import { useAxios, instance } from "../Axios";

const SongContext = React.createContext();

const Song = ({ children }) => {
	const [songList, setSongList] = useState([]);
	const [loading, setLoading] = useState(false);
	const { accessToken } = useAxios();

	const fetchSongList = useCallback(async () => {
		try {
			setLoading(true);
			const response = await instance.get(apis.songs.get());
			console.log("Song response:", response);
			if (response.status === 200) {
				setSongList(response.data);
			}
		} catch (error) {
			console.log("Error response:", error.response);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (accessToken) {
			fetchSongList();
		}
	}, [fetchSongList, accessToken]);

	return (
		<SongContext.Provider
			value={{
				songList,
				loading,
			}}>
			{children}
		</SongContext.Provider>
	);
};

export const useSong = () => React.useContext(SongContext);
export default React.memo(Song);
