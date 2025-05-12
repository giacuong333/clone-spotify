import { Popover } from "antd";
import SongIcon from "../../../components/Icons/SongIcon";
import { useMemo, useState } from "react";
import { usePlaylist } from "../../../contexts/playlist";
import { useNavigate } from "react-router-dom";
import paths from "../../../constants/paths";

const PlaylistItem = ({ playlistItem }) => {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const { deletePlaylist } = usePlaylist();
	const navigate = useNavigate();

	const handleContextMenu = (e) => {
		e.preventDefault();
		setPosition({ x: e.clientX, y: e.clientY });
		setVisible(true);
	};

	const handleVisibleChange = (newVisible) => {
		setVisible(newVisible);
	};

	const handleDelete = async () => {
		await deletePlaylist(playlistItem?.id);
	};

	const handleNavigate = (playlist_id) => {
		navigate(paths.playlist.replace(":id", playlist_id));
	};

	const content = useMemo(() => {
		return (
			<div className='bg-gray-900/10 rounded shadow-lg py-1'>
				<button
					className='w-full text-left text-white hover:bg-white/20 px-4 py-2 cursor-pointer'
					onClick={handleDelete}>
					Delete
				</button>
				<button className='w-full text-left text-white hover:bg-white/20 px-4 py-2 cursor-pointer'>
					Edit
				</button>
				{/* <button className='w-full text-left text-white hover:bg-white/20 px-4 py-2 cursor-pointer'>
					Share
				</button> */}
			</div>
		);
	}, []);

	return (
		<>
			<Popover
				content={content}
				open={visible}
				onOpenChange={handleVisibleChange}
				trigger='contextMenu'
				placement='bottomRight'
				overlayClassName='playlist-context-menu'
				destroyTooltipOnHide
				getPopupContainer={(triggerNode) => triggerNode.parentNode}
				// Style to position the popover at the click location
				overlayStyle={{
					position: "fixed",
					top: `${position.y}px`,
					left: `${position.x}px`,
				}}
				color='gray'
				arrow={false}>
				<span style={{ display: "none" }} /> {/* Empty trigger element */}
			</Popover>
			<li
				className='px-4 py-2 hover:bg-gray-800 rounded-md mx-2 transition-all cursor-pointer'
				onContextMenu={handleContextMenu}
				onClick={() => handleNavigate(playlistItem?.id)}>
				<div className='flex items-center gap-3'>
					{playlistItem?.cover ? (
						<div className='rounded overflow-hidden w-[60px] h-[60px]'>
							<img
								src={playlistItem?.cover}
								alt={playlistItem?.name}
								className='object-center object-cover w-full h-full'
							/>
						</div>
					) : (
						<div className='bg-white/20 rounded w-[60px] h-[60px] flex items-center justify-center'>
							<SongIcon className='text-white/50' width='24' height='24' />
						</div>
					)}

					<div className='flex-1 min-w-0'>
						<p className='text-white font-medium truncate'>
							{playlistItem.name}
						</p>
						<p className='text-gray-400 text-sm truncate'>
							{playlistItem.desc}
						</p>
					</div>
				</div>
			</li>
		</>
	);
};

export default PlaylistItem;
