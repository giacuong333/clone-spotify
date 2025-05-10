import { memo, useEffect } from "react";
import PlaylistItem from "../PlaylistItem";
import { usePlaylist } from "../../../contexts/playlist";

const PlaylistList = () => {
	const { playlists, fetchPlaylists, loadingPlaylists } = usePlaylist();

	useEffect(() => {
		fetchPlaylists();
	}, [fetchPlaylists]);

	if (loadingPlaylists) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
			</div>
		);
	}

	return (
		<>
			<ul>
				<div className='overflow-y-auto pb-4 flex-1'>
					<div className='px-4 py-2'>
						<input
							type='text'
							placeholder='Search your playlists'
							className='bg-gray-700 text-white px-3 py-2 rounded-full w-full focus:outline-none focus:ring-1 focus:ring-white text-sm'
						/>
					</div>
					<div className='flex justify-between items-center px-6 py-4'>
						<button className='text-gray-400 text-sm hover:text-white'>
							Recent
						</button>
					</div>
					<ul className='space-y-1'>
						{playlists.map((item, index) => (
							<PlaylistItem key={item?.id || index} playlistItem={item} />
						))}
					</ul>
				</div>
			</ul>
		</>
	);
};

export default memo(PlaylistList);
