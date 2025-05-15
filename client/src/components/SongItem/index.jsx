import React from "react";
import PlusCircleIcon from "../Icons/PlusCircleIcon";
import ThreeDotsIcon from "../Icons/ThreeDotsIcon";
import PlayIcon from "../Icons/PlayIcon";
import formatTime from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const SongItem = ({
	item,
	order,
	playlistId,
	onPlaySong,
	onAddSongToPlaylist,
}) => {
	const navigate = useNavigate();

	const handleSongDetailsNavigate = () => {
		navigate(paths.details + `?detailsId=${item?.id}&type=song`);
	};

	return (
		<li className='group'>
			<div className='px-4 py-2 flex items-center justify-between group-hover:bg-white/25 rounded'>
				<div className='flex items-center gap-4'>
					<>
						<PlayIcon
							className='group-hover:block hidden w-4 h-4 text-white cursor-pointer'
							onClick={onPlaySong}
						/>
						<p className='group-hover:hidden text-white/50'>{order}</p>
					</>
					<div className='flex items-center gap-4'>
						<div className='max-w-10 h-auto rounded-md overflow-hidden'>
							<img
								src={item?.cover_url}
								alt='Song'
								className='w-full h-full object-center object-cover cursor-pointer'
								onClick={handleSongDetailsNavigate}
							/>
						</div>
						<div className='flex flex-col items-start'>
							<p
								className='capitalize text-white font-semibold hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'
								onClick={handleSongDetailsNavigate}>
								{item?.title}
							</p>
							<p className='capitalize text-white/75 group-hover:text-white text-sm hover:underline cursor-pointer truncate md:max-w-3xs lg:max-w-sm 2xl:max-w-fit'>
								{item?.genre?.map((g) => g.name).join(", ")}
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
					<span
						className='opacity-0 group-hover:opacity-100'
						onClick={onAddSongToPlaylist}>
						<PlusCircleIcon className='w-4 h-4 text-white/75 cursor-pointer hover:text-white' />
					</span>
					<p className='text-white/50'>{formatTime(item?.duration)}</p>
					<span className='opacity-0 group-hover:opacity-100'>
						<ThreeDotsIcon className='w-6 h-6 text-white/75 cursor-pointer hover:text-white' />
					</span>
				</div>
			</div>
		</li>
	);
};

export default React.memo(SongItem);
