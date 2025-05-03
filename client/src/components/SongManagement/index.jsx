import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag, Input, Button, Tooltip, Badge } from "antd";
import { useSong } from "../../contexts/Song";
import { useAuth } from "../../contexts/Auth";
import {
	EyeOutlined,
	SearchOutlined,
	DeleteOutlined,
	PlayCircleOutlined,
	FilterOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import SongModal from "./SongModal";
import ConfirmPopup from "../ConfirmPopup";
import formatTime from "../../utils/formatTime";

const SongManagement = () => {
	const {
		songList,
		fetchSongList,
		loadingFetchSongList,
		songDetails,
		fetchSongDetails,
		loadingFetchSongDetails,
		handleDeleteSongs,
	} = useSong();
	// const { user } = useAuth();
	const [selectionType, setSelectionType] = useState("checkbox");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		fetchSongList();
	}, [fetchSongList]);

	const rowSelection = {
		onChange: (selectionRowKeys, selectionRows) => {
			setSelectedRowKeys(selectionRowKeys);
		},
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const filteredData = useMemo(() => {
		return songList.filter(
			(song) =>
				song?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
				song?.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
				song?.genre?.some((g) =>
					g.name.toLowerCase().includes(searchText.toLowerCase())
				)
		);
	}, [songList, searchText]);

	const dataSource = filteredData.map((s, index) => ({
		key: s?.id,
		no: index + 1,
		title: s?.title,
		genre: s?.genre?.map((g) => g.name) || [],
		user: s?.user?.name || "N/A",
		file_url: s?.file_url,
		cover_url: s?.cover_url,
		duration: s?.duration,
		released_at: s?.released_at,
		approved_at: s?.approved_at,
		deleted_at: s?.deleted_at,
		// status: s?.approved_at ? "approved" : "pending",
	}));

	// const getStatusColor = (status) => {
	// 	if (status === "approved") return "green";
	// 	if (status === "pending") return "orange";
	// 	return "default";
	// };

	const columns = useMemo(
		() => [
			{
				title: "No",
				dataIndex: "no",
				key: "no",
				width: 60,
			},
			{
				title: "Song",
				dataIndex: "title",
				key: "title",
				render: (text, record) => (
					<div className='flex items-center space-x-3'>
						<div className='w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden'>
							{record.cover_url ? (
								<img
									src={record.cover_url}
									alt={text}
									className='w-full h-full object-cover'
								/>
							) : (
								<PlayCircleOutlined className='text-gray-400' />
							)}
						</div>
						<div>
							<div className='font-medium text-gray-800'>{text}</div>
							<div className='text-xs text-gray-500'>{record.user}</div>
						</div>
					</div>
				),
			},
			{
				title: "Genre",
				dataIndex: "genre",
				key: "genre",
				render: (genres) => (
					<div className='flex flex-wrap gap-1'>
						{genres.map((genre, index) => (
							<Tag key={index} color='purple' className='!rounded-full'>
								{genre}
							</Tag>
						))}
					</div>
				),
			},
			{
				title: "Duration",
				dataIndex: "duration",
				key: "duration",
				width: 100,
				render: (text) => formatTime(text),
			},
			{
				title: "Released",
				dataIndex: "released_at",
				key: "released_at",
				width: 120,
				render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
			},
			// {
			// 	title: "Status",
			// 	dataIndex: "status",
			// 	key: "status",
			// 	width: 120,
			// 	render: (status) => (
			// 		<Badge
			// 			status={status === "approved" ? "success" : "warning"}
			// 			text={<span className='capitalize'>{status}</span>}
			// 		/>
			// 	),
			// },
			{
				title: "Actions",
				dataIndex: "actions",
				key: "actions",
				width: 100,
				render: (_, record) => (
					<div className='flex space-x-2'>
						<Tooltip title='View Details'>
							<Button
								type='primary'
								shape='circle'
								icon={<EyeOutlined />}
								size='small'
								onClick={() => handleViewDetails(record.key)}
								className='bg-purple-600 hover:bg-purple-700 border-none'
							/>
						</Tooltip>
					</div>
				),
			},
		],
		[]
	);

	const handleViewDetails = async (songId) => {
		try {
			await fetchSongDetails(songId);
			setIsModalVisible(true);
		} catch (error) {
			console.log("Error occurs", error);
		}
	};

	const showDeleteConfirmation = () => {
		setIsConfirmPopupVisible(true);
	};

	const processDeleteSongs = async () => {
		if (selectedRowKeys.length === 0) return;

		setIsDeleting(true);
		try {
			const success = await handleDeleteSongs(selectedRowKeys);
			if (success) {
				setSelectedRowKeys([]);
			}
		} finally {
			setIsDeleting(false);
			setIsConfirmPopupVisible(false);
		}
	};

	const handleCancelDeleteSongs = () => {
		setIsConfirmPopupVisible(false);
	};

	const handleRefresh = () => {
		fetchSongList();
		setSearchText("");
	};

	return (
		<div className='space-y-6'>
			{/* Header Section */}
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>Song Management</h1>
				<Button
					type='text'
					icon={<ReloadOutlined />}
					onClick={handleRefresh}
					className='text-gray-500 hover:text-purple-600'>
					Refresh
				</Button>
			</div>

			{/* Filters & Actions */}
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div className='flex-grow max-w-md'>
					<Input
						placeholder='Search by title, artist, or genre'
						prefix={<SearchOutlined className='text-gray-400' />}
						onChange={handleSearch}
						value={searchText}
						className='rounded-lg'
						allowClear
					/>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						icon={<FilterOutlined />}
						className='border-gray-300 text-gray-600'>
						Filter
					</Button>

					{selectedRowKeys.length > 0 && (
						<Button
							danger
							type='primary'
							icon={<DeleteOutlined />}
							onClick={showDeleteConfirmation}
							loading={isDeleting}>
							Delete ({selectedRowKeys.length})
						</Button>
					)}
				</div>
			</div>

			{/* Table */}
			<div className='bg-white rounded-lg overflow-hidden border border-gray-100'>
				<Table
					rowSelection={{ type: selectionType, ...rowSelection }}
					dataSource={dataSource}
					columns={columns}
					loading={loadingFetchSongList}
					pagination={{
						pageSize: 10,
						showTotal: (total) => `Total ${total} songs`,
						className: "p-4",
					}}
					className='custom-table'
					rowClassName='hover:bg-gray-50'
				/>
			</div>

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
				onOk={processDeleteSongs}
				onCancel={handleCancelDeleteSongs}
				title='Are you sure you want to delete selected songs?'
				message='This action can be undone.'
			/>
		</div>
	);
};

export default SongManagement;
