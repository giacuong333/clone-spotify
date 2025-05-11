import { createContext, memo, useCallback, useContext, useState } from "react";
import { useAuth } from "../Auth";
import { instance } from "../Axios";
import { apis } from "../../constants/apis";
import { notify } from "../../components/Toast";
import {useUser} from "../User";

const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {
	const [playlists, setPlaylists] = useState([]);
	const [playlist, setPlaylist] = useState({});
	const [error, setError] = useState("");
	const [loadingPlaylists, setLoadingPlaylists] = useState(false);
	const [loadingPlaylist, setLoadingPlaylist] = useState(false);
	const { isAuthenticated } = useAuth();
	const [favoritePlaylist, setFavoritePlaylist] = useState(null);
	const { user } = useAuth();

	const fetchPlaylists = useCallback(async () => {
		if (!isAuthenticated) {
			return;
		}

		try {
			setLoadingPlaylists(true);
			const response = await instance.get(apis.playlists.getAll());
			if (response.status === 200) {
				setPlaylists(response.data);
			}
		} catch (error) {
			console.log("Error while fetching playlists", error);
			setError(error);
		} finally {
			setLoadingPlaylists(false);
		}
	}, [isAuthenticated]);

	const fetchPlaylist = useCallback(
		async (playlist_id) => {
			if (!isAuthenticated) {
				return;
			}

			try {
				setLoadingPlaylist(true);
				const response = await instance.get(apis.playlists.getDetail(), {
					params: { playlist_id },
				});
				if (response.status === 200) {
					setPlaylist(response.data);
				}
			} catch (error) {
				console.log("Error while fetching playlist", error);
				setError(error);
			} finally {
				setLoadingPlaylist(false);
			}
		},
		[isAuthenticated]
	);

	const fetchPlaylistsByUser = useCallback(async (userId) => {
		if (!isAuthenticated) {
			return;
		}

		try {
			const response = await instance.get(apis.playlists.getByUserId(userId));
			if (response.status === 200) {
				return response;
			}
		} catch (error) {
			console.log("Error while fetching playlists by user: ", error);
			setError(error);
		} 
	}, [isAuthenticated]);

	const fetchFavoritePlaylist = useCallback(async () => {
		if (!isAuthenticated) {
			return;
		}

		try {
			const response = await instance.get(apis.playlists.getFavoritePlaylist(user?.id));
			if (response.status === 200) {
				setFavoritePlaylist(response.data);
			}
			return response.data;
		} catch (error) {
			console.log("Error while fetching favorite playlist: ", error);
			setError(error);
		} 
	}, [isAuthenticated]);

	const addSongToPlaylist = useCallback(
		async (payload) => {
			if (!isAuthenticated) {
				return;
			}

			const isInPlaylist = playlist?.songs?.some((s) => {
				return s.song?.id === payload?.song_id;
			});

			if (isInPlaylist) {
				notify("Song is in playlist", "error");
				return;
			}

			try {
				setLoadingPlaylists(true);
				const response = await instance.post(
					apis.playlists.addSongToPlaylist(),
					payload
				);
				if (response.status === 201 || response.status === 200) {
					notify("Added");
					await fetchPlaylist(payload?.playlist_id);
				}
			} catch (error) {
				console.log("Error while adding song to playlist", error);
				setError(error);
				notify(error.response.data, "error");
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[isAuthenticated, playlist?.songs, fetchPlaylist]
	);

	const removeSongFromPlaylist = useCallback(
		async (song_id) => {
			if (!isAuthenticated) {
				return;
			}

			try {
				setLoadingPlaylists(true);
				const payload = { playlist_id: playlist?.id, song_id };
				const response = await instance.post(
					apis.playlists.removeSongFromPlaylist(),
					payload
				);
				if (response.status === 204) {
					notify("Deleted");
					await fetchPlaylist(playlist?.id);
				}
			} catch (error) {
				console.log("Error while removing song from playlist", error);
				setError(error);
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[isAuthenticated, playlist?.id, fetchPlaylist]
	);

	const editPlaylistTitle = useCallback(async () => {
		if (!isAuthenticated) {
			return;
		}

		try {
			setLoadingPlaylists(true);
		} catch (error) {
			console.log("Error while editing playlist", error);
			setError(error);
		} finally {
			setLoadingPlaylists(false);
		}
	}, [isAuthenticated]);

	const deletePlaylist = useCallback(
		async (playlist_id) => {
			if (!isAuthenticated) {
				return;
			}

			try {
				setLoadingPlaylists(true);
				const response = await instance.delete(
					apis.playlists.deletePlaylist(),
					{ params: { playlist_id } }
				);
				if (response.status === 204) {
					notify("Playlist deleted");
					await fetchPlaylists();
					await fetchPlaylist();
				}
			} catch (error) {
				console.log("Error while deleting playlist", error);
				setError(error);
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[isAuthenticated, fetchPlaylists, fetchPlaylist]
	);

	const createPlaylist = useCallback(
		async (payload) => {
			if (!isAuthenticated) {
				return;
			}

			try {
				setLoadingPlaylists(true);
				const response = await instance.post(
					apis.playlists.createPlaylist(),
					payload
				);
				if (response.status === 201) {
					notify("Playlist created");
					await fetchPlaylists();
				}
			} catch (error) {
				console.log("Error while deleting playlist", error);
				setError(error);
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[isAuthenticated, fetchPlaylists]
	);

	return (
		<PlaylistContext.Provider
			value={{
				playlists,
				playlist,

				loadingPlaylists,
				loadingPlaylist,

				error,

				fetchPlaylists,
				fetchPlaylist,
				addSongToPlaylist,
				removeSongFromPlaylist,
				editPlaylistTitle,
				deletePlaylist,
				createPlaylist,

				fetchPlaylistsByUser,
				fetchFavoritePlaylist,
				favoritePlaylist,
			    setFavoritePlaylist,
			}}>
			{children}
		</PlaylistContext.Provider>
	);
};

export const usePlaylist = () => useContext(PlaylistContext);
export default memo(PlaylistProvider);
