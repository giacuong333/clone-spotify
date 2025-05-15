import { Music, Pause, PauseIcon } from "lucide-react";
import formatTime from "../../../utils/formatTime";
import formatTotalDuration from "../../../utils/formatTotalDuration";
import PlayIcon from "../../Icons/PlayIcon";
import PlusCircleIcon from "../../Icons/PlusCircleIcon";
import ThreeDotsIcon from "../../Icons/ThreeDotsIcon";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../../contexts/Player";

const SearchResult = ({ searchResult, type }) => {
	const navigate = useNavigate();
	const { playSong, currentSong, togglePlay, isPlaying } = usePlayer();

	const users = searchResult.users;
	const songs = searchResult.songs;
	const playlists = searchResult.playlists;

	if (users?.length === 0 && songs?.length === 0 && playlists?.length === 0) {
		return <div className='text-white/70 text-lg mt-6'>Not Found.</div>;
	}

	const handleNavigate = () => {};

	const handlePlaySong = (song, playlist) => {
		if (song?.id === currentSong?.id) {
			togglePlay();
		} else {
			playSong(song, songs || playlist, 0, playlist?.id);
		}
	};

	return (
		<div className='overflow-y-scroll min-h-screen'>
			<div>
				{(type?.name === "Songs" || type?.name === "All") &&
					songs?.length !== 0 && (
						<>
							<p className='text-white text-lg font-bold mt-6 pb-4'>Songs</p>
							<ul>
								{songs?.map((item, index) => {
									return (
										<li key={item?.id} className='group'>
											<div className='px-4 py-2 flex items-center justify-between group-hover:bg-white/25 rounded'>
												<div className='flex items-center gap-4'>
													<div onClick={() => handlePlaySong(item)}>
														{item?.id === currentSong?.id && isPlaying ? (
															<PauseIcon
																className='group-hover:block hidden w-4 h-4 text-white cursor-pointer'
																fill='white'
															/>
														) : (
															<PlayIcon
																className='group-hover:block hidden w-4 h-4 text-white cursor-pointer'
																fill='white'
															/>
														)}
														<p className='group-hover:hidden text-white/50'>
															{index + 1}
														</p>
													</div>
													<div className='flex items-center gap-4'>
														<div className='w-10 h-10 overflow-hidden rounded-full'>
															<img
																src={item?.cover_url}
																alt='Song'
																className='w-full h-full object-center object-cover cursor-pointer'
															/>
														</div>
														<div className='flex flex-col items-start'>
															<p className='capitalize text-white font-semibold hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
																{item?.title}
															</p>
															{item?.genres?.length !== 0 && (
																<p className='capitalize text-white/75 group-hover:text-white text-sm hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
																	{item?.genre?.map((g) => g.name).join(", ")}
																</p>
															)}
														</div>
													</div>
												</div>
												<div className='flex items-center gap-4'>
													<span className='grow place-items-end ms-auto'>
														<p className='text-white/50 group-hover:text-white'>
															{item?.listened_at_count}
														</p>
													</span>
													<span className='opacity-0 group-hover:opacity-100'>
														<PlusCircleIcon className='w-4 h-4 text-white/75 cursor-pointer hover:text-white' />
													</span>
													<p className='text-white/50'>
														{formatTime(item?.duration)}
													</p>
													<span className='opacity-0 group-hover:opacity-100'>
														<ThreeDotsIcon className='w-6 h-6 text-white/75 cursor-pointer hover:text-white' />
													</span>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</>
					)}

				{(type?.name === "Users" || type?.name === "All") &&
					users?.length !== 0 && (
						<>
							<p className='text-white text-lg font-bold mt-6 pb-4'>Users</p>
							<ul>
								{users?.map((item, index) => {
									return (
										<li key={item?.id} className='group'>
											<div className='px-4 py-2 flex items-center justify-between group-hover:bg-white/25 rounded'>
												<div className='flex items-center gap-4'>
													<p className='text-white/50'>{index + 1}</p>
													<div className='flex items-center gap-4'>
														<div className='w-10 h-10 overflow-hidden rounded'>
															<img
																src={
																	item?.image ||
																	"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
																}
																alt='Song'
																className='w-full h-full object-center object-cover cursor-pointer'
															/>
														</div>
														<div className='flex flex-col items-start'>
															<p className='capitalize text-white font-semibold hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
																{item?.name}
															</p>
															{item?.genres?.length !== 0 && (
																<p className='capitalize text-white/75 group-hover:text-white text-sm hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
																	{item?.genre?.map((g) => g.name).join(", ")}
																</p>
															)}
														</div>
													</div>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</>
					)}

				{(type?.name === "Playlists" || type?.name === "All") &&
					playlists?.length !== 0 && (
						<>
							<p className='text-white text-lg font-bold mt-6 pb-4'>
								Playlists
							</p>
							<ul>
								{playlists?.map((item, index) => {
									return (
										<li key={item?.id} className='group'>
											<div className='px-4 py-2 flex items-center justify-between group-hover:bg-white/25 rounded'>
												<div className='flex items-center gap-4'>
													<div
														onClick={() =>
															handlePlaySong(item?.songs[0], item)
														}>
														<PlayIcon className='group-hover:block hidden w-4 h-4 text-white cursor-pointer' />
														<p className='group-hover:hidden text-white/50'>
															{index + 1}
														</p>
													</div>
													<div className='flex items-center gap-4'>
														<div className='w-10 h-10 overflow-hidden rounded bg-gray-700/50 flex items-center justify-center'>
															{item?.cover ? (
																<img
																	src={item?.cover}
																	alt='Song'
																	className='w-full h-full object-center object-cover cursor-pointer'
																/>
															) : (
																<Music size={30} className='text-gray-400' />
															)}
														</div>
														<div className='flex flex-col items-start'>
															<p className='capitalize text-white font-semibold hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
																{item?.name}
															</p>
															<p className='capitalize text-white/50 hover:text-white hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
																{item?.user?.name}
															</p>
														</div>
													</div>
												</div>
												<div className='flex items-center gap-4'>
													<span className='grow place-items-end ms-auto'>
														<p className='text-white/50 group-hover:text-white'>
															{item?.listened_at_count}
														</p>
													</span>
													<span>
														<p className='text-white/50'>
															{formatTotalDuration(item?.songs)}
														</p>
													</span>
													<span className='opacity-0 group-hover:opacity-100'>
														<PlusCircleIcon className='w-4 h-4 text-white/75 cursor-pointer hover:text-white' />
													</span>
													<span className='opacity-0 group-hover:opacity-100'>
														<ThreeDotsIcon className='w-6 h-6 text-white/75 cursor-pointer hover:text-white' />
													</span>
												</div>
											</div>
										</li>
									);
								})}
							</ul>
						</>
					)}

				{type?.name === "Genres" && songs?.length !== 0 && (
					<>
						<p className='text-white text-lg font-bold mt-6 pb-4'>Genres</p>
						<ul>
							{songs?.map((item, index) => {
								return (
									<li key={item?.id} className='group'>
										<div className='px-4 py-2 flex items-center justify-between group-hover:bg-white/25 rounded'>
											<div className='flex items-center gap-4'>
												<div onClick={() => handlePlaySong(item)}>
													{item?.id === currentSong?.id && isPlaying ? (
														<PauseIcon
															className='group-hover:block hidden w-4 h-4 text-white cursor-pointer'
															fill='white'
														/>
													) : (
														<PlayIcon
															className='group-hover:block hidden w-4 h-4 text-white cursor-pointer'
															fill='white'
														/>
													)}
													<p className='group-hover:hidden text-white/50'>
														{index + 1}
													</p>
												</div>
												<div className='flex items-center gap-4'>
													<div className='w-10 h-10 overflow-hidden rounded-full'>
														<img
															src={item?.cover_url}
															alt='Song'
															className='w-full h-full object-center object-cover cursor-pointer'
														/>
													</div>
													<div className='flex flex-col items-start'>
														<p className='capitalize text-white font-semibold hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
															{item?.title}
														</p>
														{item?.genres?.length !== 0 && (
															<p className='capitalize text-white/75 group-hover:text-white text-sm hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
																{item?.genre?.map((g) => g.name).join(", ")}
															</p>
														)}
													</div>
												</div>
											</div>
											<div className='flex items-center gap-4'>
												<span className='grow place-items-end ms-auto'>
													<p className='text-white/50 group-hover:text-white'>
														{item?.listened_at_count}
													</p>
												</span>
												<span className='opacity-0 group-hover:opacity-100'>
													<PlusCircleIcon className='w-4 h-4 text-white/75 cursor-pointer hover:text-white' />
												</span>
												<p className='text-white/50'>
													{formatTime(item?.duration)}
												</p>
												<span className='opacity-0 group-hover:opacity-100'>
													<ThreeDotsIcon className='w-6 h-6 text-white/75 cursor-pointer hover:text-white' />
												</span>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					</>
				)}
			</div>
		</div>
	);
};

export default SearchResult;
