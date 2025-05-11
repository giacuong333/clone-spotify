import React, { useCallback, useState } from "react";
import { apis } from "../../constants/apis";
import { instance } from "../Axios";
import { notify } from "../../components/Toast";
import { useAuth } from "../../contexts/Auth";

const SongContext = React.createContext();

const Song = ({ children }) => {
	const [songList, setSongList] = useState([]);
	const [songDetails, setSongDetails] = useState(null);
	const [loadingFetchSongList, setLoadingFetchSongList] = useState(false);
	const [loadingFetchDetails, setLoadingFetchDetails] = useState(false);
	const { isAuthenticated } = useAuth();

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
			} return response;
		} catch (error) {
			console.log("Error response:", error.response);
		} finally {
			setLoadingFetchDetails(false);
		}
	}, []);

	const fetchSongsByUserId = useCallback(async (userId) => {
		try {
			const response = await instance.get(apis.songs.getByUserId(userId));
			if (response.status === 200) {
				return response;
			}
		} catch (error) {
			console.log("Error response:", error.response);
		}
	}, []);

	const handleDeleteSongs = async (songIds) => {
		try {
			const data = { song_ids: songIds };
			setLoadingFetchSongList(true);
			const response = await instance.post(apis.songs.delete(), { data });
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

	const create = useCallback(
		async (formData) => {
			// if (!isAuthenticated) {
			// 	notify("Login to upload song", "error");
			// 	return;
			// }

			try {
				const response = await instance.post(apis.songs.create(), formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				if (response.status === 201) {
					notify("Song uploaded successfully");
					await fetchSongList();
					return response.data;
				} else {
					throw new Error("Failed to upload song");
				}
			} catch (error) {
				console.log("Error creating song:", error);
				notify("Upload failed", "error");
				throw error;
			}
		},
		[fetchSongList]
	);

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

	const handleDownloadVideo = useCallback(
		async (event, video_url, title, userName) => {
			event.stopPropagation();
			event.preventDefault();

			if (!isAuthenticated) {
				notify("Login to download the video", "error");
				return;
			}

			if (video_url) {
				try {
					const downloadLink = document.createElement("a");

					const response = await fetch(video_url);
					const blob = await response.blob();
					const blobUrl = URL.createObjectURL(blob);

					downloadLink.href = blobUrl;
					const fileName = `${title || "video"}-${userName}.mp4`;
					downloadLink.setAttribute("download", fileName);

					document.body.appendChild(downloadLink);
					downloadLink.click();
					notify("Downloaded");

					setTimeout(() => {
						document.body.removeChild(downloadLink);
						URL.revokeObjectURL(blobUrl);
					}, 100);
				} catch (error) {
					console.error("Error downloading the video file:", error);
					notify("Download failed", "error");
				}
			}
		},
		[isAuthenticated]
	);

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
				handleDownloadVideo,
				fetchSongsByUserId,
			}}>
			{children}
		</SongContext.Provider>
	);
};

export const useSong = () => React.useContext(SongContext);
export default React.memo(Song);
