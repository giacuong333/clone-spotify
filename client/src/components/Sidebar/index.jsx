import React, { useState, useEffect } from "react";
import { BarsOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tooltip, Modal, Input, message } from "antd";
import { usePlaylist } from "../../contexts/playlist";
const Sidebar = () => {
    const {
        playlistList,
        fetchPlaylistList,
        createPlaylist,
        updatePlaylist,
        handleDeletePlaylists,
        addSongToPlaylist,
    } = usePlaylist();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [editingPlaylist, setEditingPlaylist] = useState(null);

	useEffect(() => {
        fetchPlaylistList(); // Lấy danh sách playlist khi component được mount
    }, [fetchPlaylistList]);

	const handleCreatePlaylist = async () => {
		try {
			await createPlaylist({ name: newPlaylistName });
			setNewPlaylistName("");
			setIsModalVisible(false);
		} catch (error) {
			console.error("Error creating playlist:", error);
		}
	};

	const handleEditPlaylist = async (playlistId, updatedData) => {
		try {
			await updatePlaylist(playlistId, updatedData);
			message.success("Playlist updated successfully");
			fetchPlaylistList(); // Refresh the list after editing
		}
		catch (error) {
			console.error("Error updating playlist:", error);
			message.error("Failed to update playlist");
		}
	};

	const handleDeletePlaylist = async (playlistId) => {
		try {
			await handleDeletePlaylists([playlistId]);
			message.success("Playlist deleted successfully");
			fetchPlaylistList(); // Refresh the list after deletion
		}
		catch (error) {
			console.error("Error deleting playlist:", error);
			message.error("Failed to delete playlist");
		}
	};

	const handleAddSongToPlaylist = async (playlistId, songId) => {
		try {
			await addSongToPlaylist(playlistId, songId);
			message.success("Song added to playlist successfully");
			fetchPlaylistList(); // Refresh the list after adding song
		}
		catch (error) {
			console.error("Error adding song to playlist:", error);
			message.error("Failed to add song to playlist");
		}
	};
	
    
    return (
        <div className='flex flex-col bg-[#121212] rounded-lg w-full min-h-screen max-h-screen overflow-hidden'>
            {/* Top */}
            <div className='flex items-center justify-between p-6'>
                <div className='flex items-center gap-2 cursor-pointer transition-all hover:text-white'>
                    <BarsOutlined className='text-lg font-semibold !text-gray-200' />
                    <p className='text-lg font-semibold text-gray-200'>Your Library</p>
                </div>
                <div>
                    <Tooltip title='Create playlist'>
                        <PlusOutlined
                            className='text-lg font-semibold !text-gray-200 cursor-pointer transition-all hover:text-white hover:bg-gray-600 p-2 rounded-full'
                            onClick={() => setIsModalVisible(true)}
                        />
                    </Tooltip>
                </div>
            </div>

       			{/* Playlists */}
			<div className='p-2 max-h-96 h-full overflow-y-scroll'>
				{playlistList.map((playlist) => (
					<div key={playlist.id} className='bg-[#1f1f1f] mb-6 rounded-lg'>
						<div className='p-6'>
							<p className='text-white font-bold mb-1'>{playlist.name}</p>
							<div className='flex gap-2 mt-4'>
								<Button
									className='!font-bold !rounded-full hover:!bg-gray-200 hover:!text-black !border-none hover:scale-[1.05]'
									onClick={() =>
										handleEditPlaylist(playlist.id, { name: "Updated Name" })
									}
								>
									Edit
								</Button>
								<Button
									danger
									className='!font-bold !rounded-full hover:!bg-red-500 hover:!text-white !border-none hover:scale-[1.05]'
									onClick={() => handleDeletePlaylist(playlist.id)}
								>
									Delete
								</Button>
								<Button
									className='!font-bold !rounded-full hover:!bg-gray-200 hover:!text-black !border-none hover:scale-[1.05]'
									onClick={() => handleAddSongToPlaylist(playlist.id, "song_id")}
								>
									Add Song
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>

            {/* Modal */}
            <Modal
                title='Create Playlist'
                visible={isModalVisible}
                onOk={handleCreatePlaylist}
                onCancel={() => setIsModalVisible(false)}
            >
                <Input
                    placeholder='Playlist name'
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default Sidebar;