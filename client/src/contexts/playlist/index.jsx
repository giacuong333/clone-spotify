import { createContext, memo, useCallback, useContext, useState } from "react";
import { useAuth } from "../Auth";
import { instance } from "../Axios";
import { apis } from "../../constants/apis";
import { notify } from "../../components/Toast";

const PlaylistContext = createContext();

const PlaylistProvider = ({ children }) => {
	const [playlists, setPlaylists] = useState([]);
	const [playlist, setPlaylist] = useState({});
	const [error, setError] = useState("");
	const [loadingPlaylists, setLoadingPlaylists] = useState(false);
	const [loadingPlaylist, setLoadingPlaylist] = useState(false);
	const [favoritePlaylist, setFavoritePlaylist] = useState(null);
	const { isAuthenticated } = useAuth();
	const { user } = useAuth();

	const searchPlaylists = useCallback(
		async (query) => {
			if (!isAuthenticated) {
				return;
			}

			try {
				setLoadingPlaylists(true);
				const response = await instance.get(apis.playlists.search(), {
					params: { query },
				});
				if (response.status === 200) {
					setPlaylists(response.data);
				}
			} catch (error) {
				console.log("Error while fetching playlists", error);
				setError(error);
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[isAuthenticated]
	);

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

			if (!playlist_id) return;

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

	const fetchPlaylistsByUser = useCallback(
		async (userId) => {
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
		},
		[isAuthenticated]
	);

	const fetchFavoritePlaylist = useCallback(async () => {
		if (!isAuthenticated) {
			return;
		}

		try {
			const response = await instance.get(
				apis.playlists.getFavoritePlaylist(user?.id)
			);
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

			if (payload?.playlist_id && !payload?.checkFavorite) {
				const isInPlaylist = playlists
					?.find((playlist) => playlist?.id === payload?.playlist_id)
					?.songs?.findIndex(
						(songItem) => songItem?.song?.id === payload?.song_id
					);

				if (isInPlaylist !== -1) {
					notify("Song is in playlist", "error");
					return;
				}
			} else if (payload?.checkFavorite && favoritePlaylist) {
				const isInFavoritePlaylist = favoritePlaylist?.songs?.some(
					(entry) => entry.song?.id === payload?.song_id
				);

				if (isInFavoritePlaylist) {
					notify("Song is already in favorites", "error");
					return;
				}
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
					await fetchPlaylists();
					if (payload?.playlist_id === favoritePlaylist?.id) {
						await fetchFavoritePlaylist();
					}
				}
			} catch (error) {
				console.log("Error while adding song to playlist", error);
				setError(error);
				notify(error.response.data, "error");
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[
			isAuthenticated,
			favoritePlaylist,
			playlists,
			fetchPlaylist,
			fetchPlaylists,
			fetchFavoritePlaylist,
		]
	);

	const removeSongFromPlaylist = useCallback(
		async (song_id) => {
			if (!isAuthenticated) {
				return;
			}

			try {
				setLoadingPlaylists(true);
				const payload = {
					playlist_id: playlist?.id || favoritePlaylist?.id,
					song_id,
				};
				console.log("playlist name", playlist?.name);
				const response = await instance.post(
					apis.playlists.removeSongFromPlaylist(),
					payload
				);
				if (response.status === 204) {
					notify("Deleted");
					await fetchPlaylist(playlist?.id);
					await fetchFavoritePlaylist();
				}
			} catch (error) {
				console.log("Error while removing song from playlist", error);
				setError(error);
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[
			isAuthenticated,
			playlist?.id,
			playlist?.name,
			favoritePlaylist?.id,
			fetchPlaylist,
			fetchFavoritePlaylist,
		]
	);

	const editPlaylist = useCallback(
		async (payload) => {
			if (!isAuthenticated) {
				return;
			}

			try {
				setLoadingPlaylists(true);
				const response = await instance.put(
					apis.playlists.editPlaylist(),
					payload,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				if (response?.status === 200) {
					notify("Playlist edited");
					await fetchPlaylists();
					await fetchPlaylist();
				}
				return response;
			} catch (error) {
				console.log("Error while deleting playlist", error);
				setError(error);
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[isAuthenticated, fetchPlaylist, fetchPlaylists]
	);

	const deletePlaylist = useCallback(
		async (playlist_id) => {
			if (!isAuthenticated) {
				return;
			}

			const isFavoritePlaylist = playlists.findIndex(
				(p) => p.is_favorite && p.id === playlist_id
			);

			if (isFavoritePlaylist !== -1) {
				notify("Can not delete favorite", "error");
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
				if (error.response.status === 403) {
					notify("Can not delete favorite", "error");
				}
			} finally {
				setLoadingPlaylists(false);
			}
		},
		[isAuthenticated, playlists, fetchPlaylists, fetchPlaylist]
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
					payload,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				if (response.status === 201) {
					notify("Playlist created");
					await fetchPlaylists();
				}
				return response;
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
				editPlaylist,
				deletePlaylist,
				createPlaylist,

				fetchPlaylistsByUser,
				fetchFavoritePlaylist,
				favoritePlaylist,
				setFavoritePlaylist,

				searchPlaylists,
			}}>
			{children}
		</PlaylistContext.Provider>
	);
};

export const usePlaylist = () => useContext(PlaylistContext);
export default memo(PlaylistProvider);
