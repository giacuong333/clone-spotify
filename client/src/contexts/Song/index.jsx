import React, { useCallback, useState } from "react";
import { apis } from "../../constants/apis";
import { instance } from "../Axios";
import { notify } from "../../components/Toast";

const SongContext = React.createContext();

const Song = ({ children }) => {
	const [songList, setSongList] = useState([]);
	const [songDetails, setSongDetails] = useState(null);
	const [loadingFetchSongList, setLoadingFetchSongList] = useState(false);
	const [loadingFetchDetails, setLoadingFetchDetails] = useState(false);
	const [searchInput, setSearchInput] = useState("");

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

	const handleDeleteSongs = async (songIds) => {
		try {
			setLoadingFetchSongList(true);
			const response = await instance.delete(apis.songs.delete(), {
				data: { song_ids: songIds },
			});
			if (response.status === 204) {
				notify("Delete successfully");
				await fetchSongList();
			}
		} catch (error) {
			notify("Delete failed", "error");
			console.log("Error occurs: ", error);
		} finally {
			setLoadingFetchSongList(false);
		}
	};

	const create = useCallback(async (formData) => {
		try {
			const response = await instance.post(apis.songs.create(), formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (response.status === 201) {
				//
			} else {
				throw new Error("Failed to upload song");
			}
		} catch (error) {
			console.log("Error creating song:", error);
			throw error;
		}
	}, []);

	const handleDownload = useCallback((event, audio_url, title, userName) => {
		event.stopPropagation();
		event.preventDefault();

		if (audio_url) {
			const downloadLink = document.createElement("a");

			fetch(audio_url)
				.then((response) => response.blob())
				.then((blob) => {
					const blobUrl = URL.createObjectURL(blob);

					downloadLink.href = blobUrl;
					const fileName = `${title || "song"}-${userName}.mp3`;
					downloadLink.setAttribute("download", fileName);

					document.body.appendChild(downloadLink);
					downloadLink.click();

					setTimeout(() => {
						document.body.removeChild(downloadLink);
						URL.revokeObjectURL(blobUrl);
					}, 100);
				})
				.catch((error) => {
					console.error("Error downloading the file:", error);
					notify("Failed to download the song", "error");
				});
		}
	}, []);

	return (
		<SongContext.Provider
			value={{
				songList,
				fetchSongList,
				loadingFetchSongList,
				songDetails,
				fetchSongDetails,
				loadingFetchDetails,
				create,
				handleDeleteSongs,
				handleDownload,
			}}>
			{children}
		</SongContext.Provider>
	);
};

export const useSong = () => React.useContext(SongContext);
export default React.memo(Song);
