import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useSong } from "../../contexts/Song";
import { useAuth } from "../../contexts/Auth";
import { EyeOutlined } from "@ant-design/icons";
import SongModal from "./SongModal";
import ConfirmPopup from "../ConfirmPopup";

const SongManagement = () => {
	const {
		songList,
		fetchSongList,
		loadingFetchSongList,
		songDetails,
		fetchSongDetails,
		loadingFetchSongDetails,
	} = useSong();
	// const { user } = useAuth();
	const [selectionType, setSelectionType] = useState("checkbox"); // Type of table selections
	const [isModalVisible, setIsModalVisible] = useState(false); // To open/close modal
	const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected rows
	const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);

	useEffect(() => {
		fetchSongList();
	}, [fetchSongList]);

	const rowSelection = {
		onChange: (selectionRowKeys, selectionRows) => {
			setSelectedRowKeys(selectionRowKeys);
			console.log("Key: ", selectionRowKeys);
			console.log("Selected row: ", selectionRows);
		},
	};

	const dataSource = songList.map((s, index) => ({
		key: s?.id,
		no: index + 1,
		title: s?.title,
		genre: s?.genre?.map((g) => g.name).join(", ") || "N/A",
		user: s?.user?.name || "N/A",
		file_url: s?.file_url,
		cover_url: s?.cover_url,
		duration: s?.duration,
		released_at: s?.released_at,
		approved_at: s?.approved_at,
		deleted_at: s?.deleted_at,
	}));

	const columns = [
		{
			title: "No",
			dataIndex: "no",
			key: "no",
		},
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Genre",
			dataIndex: "genre",
			key: "genre",
		},
		{
			title: "User",
			dataIndex: "user",
			key: "user",
		},
		{
			title: "Duration",
			dataIndex: "duration",
			key: "duration",
		},
		{
			title: "Released at",
			dataIndex: "released_at",
			key: "released_at",
			render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
		},
		{
			title: "Approved at",
			dataIndex: "approved_at",
			key: "approved_at",
			render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
		},
		{
			title: "Actions",
			dataIndex: "actions",
			key: "actions",
			render: (_, record) => (
				<EyeOutlined
					className='p-1 rounded-xs hover:bg-black/5 text-lg'
					onClick={() => handleViewDetails(record.key)}
				/>
			),
		},
	];

	const handleViewDetails = async (songId) => {
		try {
			console.log("Song id: ", songId);
			await fetchSongDetails(songId);
			setIsModalVisible(true);
		} catch (error) {
			console.log("Error occurs", error);
		}
	};

	const handleDeleteSongs = async () => {
		setIsConfirmPopupVisible(true);
		try {
			//
		} catch (error) {
			console.log("Error occurs: ", error);
		}
	};

	const handleCancelDeleteSongs = async () => {
		setSelectedRowKeys([]);
		setIsConfirmPopupVisible(false);
	};

	return (
		<div className='overflow-auto'>
			<div className='mb-4 w-full flex items-center justify-between'>
				<input
					type='text'
					placeholder='Search'
					className='border rounded p-1 px-3 placeholder:text-black'
				/>
				{selectedRowKeys.length !== 0 && (
					<button
						className='py-1 px-4 bg-red-100 hover:bg-red-50 border border-red-300 text-red-500 rounded'
						onClick={handleDeleteSongs}>
						Delete
					</button>
				)}
			</div>

			<Table
				rowSelection={{ type: selectionType, ...rowSelection }}
				dataSource={dataSource}
				columns={columns}
				loading={loadingFetchSongList}
				pagination={{ pageSize: 10 }}
			/>

			{/* Modal */}
			<SongModal
				toggle={isModalVisible}
				setToggle={() => setIsModalVisible(false)}
				songDetails={songDetails}
				loadingFetchSongDetails={loadingFetchSongDetails}
			/>

			<ConfirmPopup
				toggle={isConfirmPopupVisible}
				setToggle={handleCancelDeleteSongs}
				onOk={handleDeleteSongs}
				onCancel={handleCancelDeleteSongs}
				title='Are you sure you want to delete seleted items?'
				message='This action can be undone'
			/>
		</div>
	);
};

export default SongManagement;
