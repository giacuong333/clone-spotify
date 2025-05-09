import React, { useCallback, useState } from "react";
import { apis } from "../../constants/apis";
import { instance } from "../Axios";
import { notify } from "../../components/Toast";

const PlaylistContext = React.createContext();

const PlaylistProvider = ({ children }) => {
  const [playlistList, setPlaylistList] = useState([]); // Danh sách playlist
  const [playlistDetails, setPlaylistDetails] = useState(null); 
  const [loadingFetchPlaylistList, setLoadingFetchPlaylistList] =
    useState(false); // Trạng thái loading

  // Fetch playlist list
  const fetchPlaylistList = useCallback(async () => {
    try {
      setLoadingFetchPlaylistList(true);
      const response = await instance.get(apis.playlists.getAll());
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

    const fetchPlaylistDetails = useCallback(async (playlistId) => {
    try {
      const response = await instance.get(apis.playlists.getById(playlistId));
      if (response.status === 200) {
        setPlaylistDetails(response.data); // Cập nhật state playlistDetails
        setPlaylistList((prev) =>
          prev.map((playlist) =>
            playlist.id === playlistId ? response.data : playlist
          )
        ); // Cập nhật danh sách playlist
        return response.data;
      } else {
        throw new Error("Failed to fetch playlist details");
      }
    } catch (error) {
      console.error("Error fetching playlist details:", error.response);
      notify("Failed to fetch playlist details", "error");
      throw error;
    }
  }, []);

  // Create a new playlist
  const createPlaylist = useCallback(
    async (formData) => {
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
    },
    [fetchPlaylistList]
  );

  // Update a playlist
  const updatePlaylist = useCallback(
    async (playlistId, formData) => {
      console.log(
        "Updating playlist with ID:",
        playlistId,
        "and data:",
        formData
      ); // Log dữ liệu
      try {
        const response = await instance.put(
          apis.playlists.update(playlistId),
          formData
        );
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
    },
    [fetchPlaylistList]
  );

  const handleDeletePlaylists = useCallback(
    async (playlistId) => {
      console.log("Deleting playlist with ID:", playlistId); // Log ID để kiểm tra
      try {
        const response = await instance.delete(
          apis.playlists.delete(playlistId)
        ); // Gọi API DELETE với ID
        if (response.status === 204) {
          notify("Playlist deleted successfully");
          await fetchPlaylistList(); // Refresh danh sách playlist
        }
      } catch (error) {
        console.error(
          "Error deleting playlist:",
          error.response?.data || error.message
        ); // Log lỗi chi tiết
        notify("Failed to delete playlist", "error");
      }
    },
    [fetchPlaylistList]
  );

 const addSongToPlaylist = useCallback(
  async (playlistId, songId) => {
    try {
      const response = await instance.post(apis.playlists.addSong(playlistId), {
        song_id: songId,
      });
      if (response.status === 200) {
        notify("Song added to playlist successfully");
        await fetchPlaylistDetails(playlistId); // Fetch lại chi tiết playlist
      } else {
        throw new Error("Failed to add song to playlist");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error.response);
      notify("Failed to add song to playlist", "error");
      throw error;
    }
  },
  [fetchPlaylistDetails]
);

  return (
    <PlaylistContext.Provider
      value={{
        playlistList,
        // playlistDetails,
        fetchPlaylistList,
        fetchPlaylistDetails,
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
