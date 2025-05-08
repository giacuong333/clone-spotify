import { Button } from "antd";
import PlayIcon from "../Icons/PlayIcon";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";
import { usePlayer } from "../../contexts/Player";

const AlbumAndArtistItem = ({ item, type, index, list }) => {
	const navigate = useNavigate();
	const { playSong } = usePlayer();

	const handleClickItem = (event, path) => {
		event.stopPropagation();
		navigate(`${path}?detailsId=${item?.id}&type=${type}`);
	};

	const handlePlay = (event) => {
		event.stopPropagation();
		// When play button is clicked, play this song and provide the whole list
		if (type === "song" && item) {
			playSong(item, list || [item], index);
		}
	};

	return (
		<li
			className='group'
			onClick={(event) => handleClickItem(event, paths.details)}>
			<div className='w-40 flex flex-col items-start justify-center cursor-pointer hover:bg-neutral-800 p-4 rounded-md'>
				{/* Image */}
				<div className='min-h-32 min-w-32 max-w-32 relative'>
					<img
						src={
							item?.cover_url || // For songs
							item?.image_url || // For users
							"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
						}
						alt={item?.title}
						className={`w-full h-full object-center object-cover ${
							type === "album" ? "rounded-lg" : "rounded-full"
						}`}
					/>

					{/* Play button */}
					<div
						className='
                absolute right-2 bottom-2 size-12 bg-[#1ED760]
                opacity-0 translate-y-2
                hover:bg-[#3BE477] hover:scale-[1.05]
                group-hover:translate-y-0 group-hover:opacity-100
                shadow-lg rounded-full flex items-center justify-center
                transition-all duration-500'>
						<Button
							type='primary'
							onClick={handlePlay}
							icon={<PlayIcon width='30' height='30' />}
							className='!rounded-full !text-3xl !text-center !mx-auto !w-full !bg-transparent !text-black'
						/>
					</div>
				</div>

				{/* Texts */}
				<div className='mt-2'>
					<p className='hover:underline text-white truncate'>
						{item?.title || item?.name}
					</p>
					<p className='text-gray-400 text-sm'>{item?.artist || item?.type}</p>
				</div>
			</div>
		</li>
	);
};

export default AlbumAndArtistItem;
