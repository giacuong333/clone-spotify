import React, { useEffect, useMemo } from "react";
import { Button, Spin } from "antd";
import PlayIcon from "../Icons/PlayIcon";
import SongList from "../SongList";
import { useSearch } from "../../contexts/Search";
import { usePlayer } from "../../contexts/Player";

const types = [
	{ id: 1, name: "All" },
	{ id: 2, name: "Songs" },
	{ id: 3, name: "Playlists" },
	{ id: 4, name: "Users" },
];

const Search = () => {
	const { searchResult, searchInput, type, setType, handleSearch } =
		useSearch();
	const { playSong } = usePlayer();

	useEffect(() => {
		setType(types[0]);
	}, []);

	useEffect(() => {
		if (searchInput || type) {
			handleSearch();
		}
	}, [searchInput, type, handleSearch]);

	const searchResultSongList = useMemo(() => {
		if (searchResult.songs.length !== 0) {
			return searchResult.songs;
		} else {
			return searchResult.users[0]?.songs;
		}
	}, [searchResult.songs, searchResult.users]);

	const handlePlaySongsOfUser = () => {
		playSong(
			searchResultSongList[
				Math.floor(Math.random() * searchResultSongList.length)
			],
			searchResultSongList
		);
	};

	return (
		<React.Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<section className='2xl:max-w-10/12 w-full max-h-screen min-h-screen mx-auto 2xl:px-0 px-10 py-4'>
				{/* Type search */}
				<div>
					<ul className='flex items-center gap-3 w-full'>
						{types.map((t) => {
							return (
								<li key={t.id} className='w-fit' onClick={() => setType(t)}>
									<p
										className={`text-white px-4 py-1 cursor-pointer bg-white/10 hover:bg-white/20 rounded-full w-fit truncate text-sm ${
											t.id === type.id ? "!bg-white !text-black" : ""
										}`}>
										{t.name}
									</p>
								</li>
							);
						})}
					</ul>
				</div>
				{searchResult.songs.length === 0 &&
				searchResult.playlists.length === 0 &&
				searchResult.users.length === 0 ? (
					<p className='text-white text-2xl mt-10 font-bold'>Not found</p>
				) : (
					<>
						<div className='grid grid-cols-12 gap-4 mt-10'>
							{/* Top result */}
							<div className='col-span-3 h-[310px]'>
								<div className=''>
									<p className='text-white text-2xl font-bold mb-2'>
										Top result
									</p>
									<div className='bg-white/5 hover:bg-white/10 rounded-lg p-6 pb-16 transition-all duration-500 cursor-pointer relative group h-full overflow-hidden'>
										<span className='flex flex-col gap-2'>
											<div className='w-24 h-auto overflow-hidden rounded-full'>
												<img
													src={
														searchResult?.users[0]?.user?.image ||
														"https://i.scdn.co/image/ab6761610000517491d2d39877c13427a2651af5"
													}
													alt='Thumnail'
													className='w-full h-full object-center object-cover'
												/>
											</div>
											<div className='flex flex-col gap-2'>
												<p className='text-white text-4xl font-bold'>
													{searchResult?.users[0]?.user?.name ||
														searchResult?.songs[0]?.user?.name ||
														"User name"}
												</p>
												<p className='text-white/55'>User</p>
											</div>
										</span>
										{/* Play button */}
										<div
											className='
                absolute right-4 bottom-4 size-12 bg-[#1ED760] 
                opacity-0 translate-y-2 
                hover:bg-[#3BE477] hover:scale-[1.05] 
                group-hover:translate-y-0 group-hover:opacity-100 
                shadow-2xl rounded-full flex items-center justify-center
                transition-all duration-500'>
											<Button
												type='primary'
												icon={<PlayIcon width='30' height='30' />}
												className='!rounded-full !text-3xl !text-center !mx-auto !w-full !bg-transparent !text-black'
												onClick={handlePlaySongsOfUser}
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Songs */}
							<div className='col-span-9 h-[310px]'>
								<div className='max-h-full overflow-hidden'>
									<p className='text-white text-2xl font-bold mb-2'>Songs</p>
									<SongList songList={searchResultSongList} />
								</div>
							</div>
						</div>
					</>
				)}
			</section>
		</React.Suspense>
	);
};

export default React.memo(Search);
