import React, { useState, useEffect } from "react";
import { BarsOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Tooltip, Modal, Input, List, message } from "antd";
import { usePlaylist } from "../../contexts/playlist";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const {
    playlistList,
    fetchPlaylistList,
    createPlaylist,
    updatePlaylist,
    handleDeletePlaylists,
  } = usePlaylist(); 
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal thêm playlist
  const [newPlaylistName, setNewPlaylistName] = useState(""); // Tên playlist mới
  const [editingPlaylist, setEditingPlaylist] = useState(null); // Playlist đang chỉnh sửa
  const [deletePlaylist, setDeletePlaylist] = useState(null); // Playlist đang xóa

  // Lấy danh sách playlist khi component được mount
  useEffect(() => {
    fetchPlaylistList();
  }, [fetchPlaylistList]);

  // Thêm playlist mới
  const handleAddPlaylist = async () => {
    try {
      await createPlaylist({ name: newPlaylistName });
      setNewPlaylistName("");
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to add playlist");
    }
  };

  const handleEditPlaylist = async () => {
    if (!editingPlaylist || !editingPlaylist.id) {
      message.error("Invalid playlist ID");
      return;
    }

    console.log("Updating playlist:", editingPlaylist); // Log để kiểm tra giá trị của editingPlaylist

    try {
      await updatePlaylist(editingPlaylist.id, { name: editingPlaylist.name });
      setEditingPlaylist(null);
    } catch (error) {
      message.error("Failed to update playlist");
    }
  };

  const handleDeletePlaylist = async (id) => {
	if (!id) {
	  console.error("Invalid playlist ID:", id);
	  message.error("Invalid playlist ID");
	  return;
	}
  
	try {
	  await handleDeletePlaylists(id); // Gọi API xóa với id
	  message.success("Playlist deleted successfully");
	  fetchPlaylistList(); // Cập nhật danh sách playlist sau khi xóa
	} catch (error) {
	  console.error("Error deleting playlist:", error);
	  message.error("Failed to delete playlist");
	}
  };

  return (
    <div className="flex flex-col bg-[#121212] rounded-lg w-full min-h-screen max-h-screen overflow-hidden">
      {/* Top */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2 cursor-pointer transition-all hover:text-white">
          <BarsOutlined className="text-lg font-semibold !text-gray-200" />
          <p className="text-lg font-semibold text-gray-200">Your Library</p>
        </div>
        <div>
          <Tooltip title="Create playlist">
            <PlusOutlined
              className="text-lg font-semibold !text-gray-200 cursor-pointer transition-all hover:text-white hover:bg-gray-600 p-2 rounded-full"
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
        </div>
      </div>

      {/* Middle */}
      <div className="p-2 max-h-96 h-full overflow-y-scroll">
       		<List
		  dataSource={playlistList}
		  renderItem={(item) => (
			<List.Item
			  className="flex items-center gap-4 p-2 hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
			  onClick={() => navigate(`/playlists/${item.id}`)} // Điều hướng đến trang chi tiết playlist
			>
			  <div className="flex items-center gap-4">
				<div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
				  {item.cover_url ? (
					<img
					  src={item.cover_url}
					  alt={item.name}
					  className="w-full h-full object-cover rounded-lg"
					/>
				  ) : (
					<span className="text-white text-sm">No Image</span>
				  )}
				</div>
		
				{/* Thông tin playlist */}
				<div>
				  <p className="text-white font-semibold">{item.name}</p>
				  <p className="text-gray-400 text-sm">
					{item.songs?.length || 0} bài hát
				  </p>
				</div>
			  </div>
		
			  {/* Nút hành động với icon */}
			  <div className="flex gap-2">
				<EditOutlined
				  className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
				  onClick={(e) => {
					e.stopPropagation(); // Ngăn chặn sự kiện onClick của List.Item
					console.log("Editing playlist:", item);
					setEditingPlaylist({ id: item.id, name: item.name });
				  }}
				/>
				<DeleteOutlined
				  className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
				  onClick={(e) => {
					e.stopPropagation(); // Ngăn chặn sự kiện onClick của List.Item
					console.log("Deleting playlist:", item.id);
					handleDeletePlaylist(item.id);
				  }}
				/>
			  </div>
			</List.Item>
		  )}
		/>
      </div>

      {/* Modal thêm playlist */}
      <Modal
        title="Add Playlist"
        visible={isModalOpen}
        onOk={handleAddPlaylist}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          className="p-2 border border-gray-700 rounded-lg"
        />
      </Modal>

      {/* Modal sửa playlist */}
      {editingPlaylist && (
        <Modal
          title="Edit Playlist"
          visible={!!editingPlaylist}
          onOk={handleEditPlaylist}
          onCancel={() => setEditingPlaylist(null)}
        >
          <Input
            placeholder="Playlist name"
            value={editingPlaylist.name}
            onChange={(e) =>
              setEditingPlaylist({
                ...editingPlaylist,
                name: e.target.value,
              })
            }
            className="p-2 border border-gray-700 rounded-lg"
          />
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
