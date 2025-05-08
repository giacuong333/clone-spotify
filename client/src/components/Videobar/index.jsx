import React, { useRef, useEffect } from "react";
import { Button, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { usePlayer } from "../../contexts/Player";
import { useSong } from "../../contexts/Song";

const Videobar = () => {
	const { currentSong, isPlaying } = usePlayer();
	const { handleDownloadVideo } = useSong();
	const videoRef = useRef(null);

	useEffect(() => {
		if (!currentSong?.video_url || !videoRef.current) {
			return;
		}

		videoRef.current.src = currentSong.video_url;
		videoRef.current.load();

		if (isPlaying) {
			videoRef.current.play();
		} else {
			videoRef.current.pause();
		}
	}, [isPlaying, currentSong]);

	const handleDownloadMedia = (event) => {
		if (!currentSong?.video_url && !videoRef.current) {
			return;
		}

		handleDownloadVideo(
			event,
			currentSong?.video_url,
			currentSong?.title,
			currentSong?.user?.name
		);
	};

	return (
		<div className='w-full max-w-4xl mx-auto p-4 bg-[#121212] rounded-lg shadow-lg'>
			<div className='relative w-full aspect-video bg-black rounded-md overflow-hidden'>
				<video
					ref={videoRef}
					src={currentSong?.video_url}
					className='w-full h-full object-contain'
					muted
				/>
			</div>
			<div className='mt-4 flex justify-between items-start'>
				<div>
					<h3 className='text-lg font-semibold text-white'>
						{currentSong?.title || "No Song Selected"}
					</h3>
					<p className='text-sm text-gray-400'>
						{currentSong?.user?.name || "Unknown User"}
					</p>
				</div>
				<Tooltip title='Download Video'>
					<Button
						icon={<DownloadOutlined />}
						onClick={handleDownloadMedia}
						type='text'
						className='!text-white !text-lg hover:text-green-600'
					/>
				</Tooltip>
			</div>
		</div>
	);
};

export default Videobar;
