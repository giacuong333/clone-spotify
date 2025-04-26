import React, { useCallback, useEffect, useState } from "react";
import { apis } from "../../constants/apis";
import { useAxios, instance } from "../Axios";
import { notify } from "../../components/Toast";

const SongContext = React.createContext();

const Song = ({ children }) => {
	const [songList, setSongList] = useState([]);
	const [songDetails, setSongDetails] = useState(null);
	const [loadingFetchSongList, setLoadingFetchSongList] = useState(false);
	const [loadingFetchDetails, setLoadingFetchDetails] = useState(false);
	// const { accessToken } = useAxios();

	const fetchSongList = useCallback(async () => {
		try {
			setLoadingFetchSongList(true);
			const response = await instance.get(apis.songs.getAll());
			if (response.status === 200) {
				setSongList(response.data);
			}
		} catch (error) {
			console.log("Error response:", error.response);
		} finally {
			setLoadingFetchSongList(false);
		}
	}, []);

	const fetchSongDetails = useCallback(async (songId) => {
		try {
			setLoadingFetchDetails(true);
			const response = await instance.get(apis.songs.getById(songId));
			if (response.status === 200) {
				setSongDetails(response.data);
			}
		} catch (error) {
			console.log("Error response:", error.response);
		} finally {
			setLoadingFetchDetails(false);
		}
	}, []);

	const handleDeleteSong = useCallback(async (payload) => {
		try {
			setLoadingFetchSongList(true);
			const response = await instance.delete(apis.songs.delete(), payload);
			if (response.status === 200) {
				notify("Delete successfully");
			}
		} catch (error) {
			notify("Delete failed");
			console.log("Error occurs: ", error);
		} finally {
			setLoadingFetchSongList(false);
		}
	});

	return (
		<SongContext.Provider
			value={{
				songList,
				fetchSongList,
				songDetails,
				fetchSongDetails,
				loadingFetchSongList,
				loadingFetchDetails,
			}}>
			{children}
		</SongContext.Provider>
	);
};

export const useSong = () => React.useContext(SongContext);
export default React.memo(Song);
