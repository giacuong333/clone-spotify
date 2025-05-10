import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";
import { usePlaylist } from "../../contexts/playlist";

const PlaylistDetails = () => {
  const { fetchPlaylistDetails } = usePlaylist(); // Lấy hàm fetch từ context
  const { id } = useParams(); // Lấy ID playlist từ URL
  const [playlist, setPlaylist] = useState(null); // Trạng thái playlist
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchPlaylistDetails(id); // Gọi hàm fetch với ID
        setPlaylist(data);
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      }
    };

    fetchDetails();
  }, [id, fetchPlaylistDetails]);

  if (!playlist) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-purple-800 to-black min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 bg-gray-700 rounded-lg flex items-center justify-center">
          {playlist.cover_url ? (
            <img
              src={playlist.cover_url}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <PlayCircleOutlined className="text-white text-6xl" />
          )}
        </div>
        <div>
          <p className="uppercase text-sm font-bold">Playlist</p>
          <h1 className="text-4xl font-bold">{playlist.name}</h1>
          <p className="text-gray-400 mt-2">
            {playlist.user.name} • {playlist.songs.length} bài hát
          </p>
        </div>
      </div>

      {/* Danh sách bài hát */}
      <div className="mt-8">
        <div className="grid grid-cols-4 text-gray-400 text-sm border-b border-gray-700 pb-2">
          <p>#</p>
          <p>Tiêu đề</p>
          <p>Album</p>
          <p className="text-right">Thời gian</p>
        </div>
        {playlist.songs.map((song, index) => (
          <div
            key={song.id}
            className="grid grid-cols-4 items-center text-sm text-white py-2 hover:bg-gray-800 rounded-lg transition-all"
          >
            <p>{index + 1}</p>
            <div>
              <p className="font-semibold">{song.name}</p>
              <p className="text-gray-400 text-xs">{song.artist}</p>
            </div>
            <p>{song.album}</p>
            <p className="text-right">{song.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetails;