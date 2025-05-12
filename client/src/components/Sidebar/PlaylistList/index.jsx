import { memo, useEffect, useMemo, useState } from "react";
import PlaylistItem from "../PlaylistItem";
import { usePlaylist } from "../../../contexts/playlist";
import _ from "lodash";
import { SearchOutlined } from "@ant-design/icons";

const PlaylistList = () => {
	const [searchInput, setSearchInput] = useState("");
	const { playlists, fetchPlaylists, loadingPlaylists, searchPlaylists } =
		usePlaylist();

	useEffect(() => {
		let timeoutId;

		if (!_.isEmpty(searchInput.trim())) {
			timeoutId = setTimeout(async () => {
				await searchPlaylists(searchInput);
			}, [300]);
		} else {
			fetchPlaylists();
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [fetchPlaylists, searchInput, searchPlaylists]);

	const handleChangeInput = (e) => {
		setSearchInput(e.target.value);
	};

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
					<div className='px-6'>
						<div className='mt-2 flex items-center px-4 py-2 bg-[#242424] rounded-full w-full border-2 border-transparent focus-within:border-white hover:border-white transition'>
							<SearchOutlined className='!text-white text-lg' />
							<input
								type='text'
								placeholder='Search your playlists'
								className='px-2 w-full h-full text-white border-none outline-none'
								value={searchInput}
								onChange={handleChangeInput}
								autoFocus
							/>
						</div>
					</div>
					<div className='flex justify-between items-center px-6 py-4'>
						<button className='text-gray-400 text-sm hover:text-white'>
							Recent
						</button>
					</div>
					<ul className='space-y-1'>
						{playlists.length !== 0 ? (
							playlists.map((item, index) => (
								<PlaylistItem key={item?.id || index} playlistItem={item} />
							))
						) : (
							<li>
								<p className='text-white/50 px-6 py-2'>
									{searchInput} not found.
								</p>
							</li>
						)}
					</ul>
				</div>
			</ul>
		</>
	);
};

export default memo(PlaylistList);
