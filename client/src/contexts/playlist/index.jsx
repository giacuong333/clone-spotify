import React, { useCallback, useState } from "react";
import { apis } from "../../constants/apis";
import { instance } from "../Axios";
import { notify } from "../../components/Toast";

const PlaylistContext = React.createContext();

const PlaylistProvider = ({ children }) => {
    const [playlistList, setPlaylistList] = useState([]);
    const [loadingFetchPlaylistList, setLoadingFetchPlaylistList] = useState(false);

    // Fetch playlist list
    const fetchPlaylistList = useCallback(async () => {
        try {
            setLoadingFetchPlaylistList(true);
            const response = await instance.get(apis.playlists.getAll());
            console.log("Fetched playlist list:", response.data); // Log danh sách playlist
            if (response.status === 200) {
                setPlaylistList(response.data);
            }
        } catch (error) {
            console.error("Error fetching playlists:", error.response);
            notify("Failed to fetch playlists", "error");
        } finally {
            setLoadingFetchPlaylistList(false);
        }
    }, []);

    // Create a new playlist
    const createPlaylist = useCallback(async (formData) => {
        try {
            const response = await instance.post(apis.playlists.create(), formData);
            if (response.status === 201) {
                notify("Playlist created successfully");
                await fetchPlaylistList(); // Refresh the list
            } else {
                throw new Error("Failed to create playlist");
            }
        } catch (error) {
            console.error("Error creating playlist:", error.response);
            notify("Failed to create playlist", "error");
            throw error;
        }
    }, [fetchPlaylistList]);

    // Update a playlist
    const updatePlaylist = useCallback(async (playlistId, formData) => {
        console.log("Updating playlist with ID:", playlistId, "and data:", formData); // Log dữ liệu
        try {
            const response = await instance.put(apis.playlists.update(playlistId), formData);
            if (response.status === 200) {
                notify("Playlist updated successfully");
                await fetchPlaylistList(); // Refresh the list
            } else {
                throw new Error("Failed to update playlist");
            }
        } catch (error) {
            notify("Failed to update playlist", "error");
            throw error;
        }
    }, [fetchPlaylistList]);

    // Delete playlists
    const handleDeletePlaylists = useCallback(async (playlistIds) => {
        console.log("Deleting playlists with IDs:", playlistIds); // Log danh sách ID
        try {
            const response = await instance.post(apis.playlists.delete(), {
                playlist_ids: playlistIds,
            });
            if (response.status === 200) {
                notify("Playlists deleted successfully");
                await fetchPlaylistList(); // Refresh the list
            }
        } catch (error) {
            console.error("Error deleting playlists:", error.response?.data); // Log lỗi chi tiết
            notify("Failed to delete playlists", "error");
        }
    }, [fetchPlaylistList]);

    // Add song to playlist
    const addSongToPlaylist = useCallback(async (playlistId, songId) => {
        console.log("Adding song with ID:", songId, "to playlist with ID:", playlistId); // Log dữ liệu
        try {
            const response = await instance.post(apis.playlists.addSong(playlistId), {
                song_id: songId,
            });
            if (response.status === 200) {
                notify("Song added to playlist successfully");
                await fetchPlaylistList(); // Refresh the list
            } else {
                throw new Error("Failed to add song to playlist");
            }
        } catch (error) {
            console.error("Error adding song to playlist:", error.response?.data); // Log lỗi chi tiết
            notify("Failed to add song to playlist", "error");
        }
    }, [fetchPlaylistList]);

    return (
        <PlaylistContext.Provider
            value={{
                playlistList,
                fetchPlaylistList,
                loadingFetchPlaylistList,
                createPlaylist,
                updatePlaylist,
                handleDeletePlaylists,
                addSongToPlaylist,
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => React.useContext(PlaylistContext);
export default React.memo(PlaylistProvider);