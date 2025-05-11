import React from "react";
import VerifiedBadge from "../../Icons/VerifiedBadge";
import formatTime from "../../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import paths from "../../../constants/paths";

const SongCover = ({ song }) => {
	const navigate = useNavigate();

	const handleUserClick = () => {
		navigate(paths.details+`?detailsId=${song?.user?.id}&type=user`);
	}
	return (
		<div className='flex items-center p-6 bg-gradient-to-b from-[#2a6e7f] to-[#0f2a2e] rounded-xl text-white'>
			{/* Avatar */}
			<img
				src={
					song?.cover_url ||
					"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
				}
				alt={`${name}'s avatar`}
				className='w-50 h-50 object-cover shadow-lg rounded-lg'
			/>

			{/* Info */}
			<div className='ml-6 w-fit'>
				<p className='text-lg text-white/80 mb-1 font-bold'>Song</p>
				<h1 className='text-6xl font-bold w-full max-w-md break-words'>{song?.title || "Demo"}</h1>
				<div className="flex items-center gap-2 mt-5">
					<div className="flex items-center gap-3">
							<img className="w-8 h-8 rounded-b-full"
								src={song?.user?.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"} 
								alt="" />
							<p className='text-md text-white/80 mb-1'>
								<span className="font-bold hover:underline hover:cursor-pointer" onClick={handleUserClick}>{song?.user?.name}</span> &bull; {new Date(song?.released_at).getFullYear()} &bull; {formatTime(song?.duration)} &bull; {song?.listened_at_count} views
							</p>
						</div>
					
				</div>
			</div>
		</div>
	);
};

export default SongCover;
