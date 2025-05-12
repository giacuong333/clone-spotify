import { memo, useState, useRef, useCallback } from "react";
import {
	CloseOutlined,
	PlayCircleFilled,
	PauseCircleFilled,
	TagOutlined,
	ClockCircleOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
	AudioOutlined,
	DownloadOutlined,
} from "@ant-design/icons";
import Overlay from "../../Overlay";
import VolumeIcon from "../../Icons/VolumnIcon";
import { Spin, Button, Tooltip } from "antd";
import formatDate from "../../../utils/formatDate";
import formatTime from "../../../utils/formatTime";
import { useSong } from "../../../contexts/Song";

const SongModal = ({
	toggle,
	setToggle,
	songDetails,
	loadingFetchSongDetails,
}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(0.5);
	const [showVolume, setShowVolume] = useState(false);

	const audioRef = useRef(null);
	const videoRef = useRef(null);
	const volumeTimerRef = useRef(null);

	const { handleDownload, handleDownloadVideo } = useSong();

	const isVideo = songDetails?.video_url || songDetails?.media_type === "video";

	// Handle play/pause
	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
				videoRef.current.pause();
			} else {
				audioRef.current.play();
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	// Handle time update
	const handleTimeUpdate = useCallback(() => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
			setDuration(audioRef.current.duration || songDetails?.duration || 0);
		}
	}, [isVideo, songDetails?.duration]);

	// Handle seek
	const handleSeek = (e) => {
		const newTime = parseFloat(e.target.value);
		if (audioRef.current) {
			audioRef.current.currentTime = newTime;
			if (isVideo && videoRef.current) {
				videoRef.current.currentTime = newTime;
			}
			setCurrentTime(newTime);
		}
	};

	// Handle volume change
	const handleVolumeChange = useCallback((e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		if (audioRef.current) audioRef.current.volume = newVolume;
		setShowVolume(true);
		if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current);
		volumeTimerRef.current = setTimeout(() => setShowVolume(false), 1000);
	}, []);

	const toggleMute = () => {
		if (audioRef.current) {
			if (volume !== 0) {
				audioRef.current.volume = 0;
				audioRef.current.previousVolume = volume;
				setVolume(0);
			} else {
				audioRef.current.volume = audioRef.current.previousVolume;
				setVolume(audioRef.current.previousVolume);
			}
		}
	};

	// Handle media end
	const handleEnded = () => {
		setIsPlaying(false);
		setCurrentTime(0);
		if (isVideo && videoRef.current) {
			videoRef.current.currentTime = 0;
			videoRef.current.pause();
		}
	};

	// Handle download
	const handleDownloadMedia = (event) => {
		if (!isVideo) {
			handleDownload(
				event,
				songDetails?.audio_url,
				songDetails?.title,
				songDetails?.user?.name
			);
		} else {
			handleDownloadVideo(
				event,
				songDetails?.video_url,
				songDetails?.title,
				songDetails?.user?.name
			);
		}
	};

	// Reset on modal close or song change
	const handleCloseOrChange = () => {
		if (isPlaying && audioRef.current) {
			audioRef.current.pause();
			if (isVideo && videoRef.current) videoRef.current.pause();
			setIsPlaying(false);
			setCurrentTime(0);
		}
		setToggle(false);
	};

	return (
		<>
			<Overlay toggle={toggle} setToggle={setToggle} />
			{loadingFetchSongDetails ? (
				<Spin spinning tip='Loading details...' fullscreen size='large' />
			) : (
				<section
					className={`lg:w-2/3 xl:w-2/3 w-full max-h-[90vh] fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-0 overflow-hidden transition-all duration-300 ${
						toggle
							? "pointer-events-auto opacity-100 scale-100"
							: "pointer-events-none opacity-0 scale-95"
					}`}>
					<div className='relative'>
						{songDetails?.cover_url && (
							<div
								className='absolute inset-0 bg-cover bg-center'
								style={{
									backgroundImage: `url(${songDetails.cover_url})`,
									filter: "blur(10px)",
									opacity: 0.8,
								}}
							/>
						)}
						<div className='relative bg-gradient-to-l from-black/5 to-black/20 p-6 text-white'>
							<div className='flex justify-between items-start'>
								<div className='flex items-center space-x-2'>
									<h2 className='text-3xl font-bold text-white/70'>
										{songDetails?.title || "Media Details"}
									</h2>
									<AudioOutlined className='text-purple-500 text-xl' />
								</div>
								<button
									className='bg-white/20 text-white hover:bg-white/50 rounded-md py-2 px-2.5 transition-colors cursor-pointer'
									onClick={handleCloseOrChange}>
									<CloseOutlined className='text-lg !text-black/70' />
								</button>
							</div>
							<p className='text-sm opacity-90 mt-1 text-white/70'>
								{songDetails?.user?.name || "Unknown Artist"}
							</p>
						</div>
					</div>

					<div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>
						<div className='flex flex-col lg:flex-row gap-6'>
							<div className='lg:w-1/3 relative group'>
								{isVideo ? (
									<video
										ref={videoRef}
										src={songDetails.video_url}
										poster={songDetails.cover_url}
										className='w-full rounded-lg shadow-md'
										preload='metadata'
										muted
									/>
								) : (
									<div className='relative'>
										{songDetails?.cover_url ? (
											<img
												src={songDetails.cover_url}
												alt={songDetails.title || "Album cover"}
												className='w-full aspect-square object-cover rounded-lg shadow-md'
											/>
										) : (
											<div className='w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center'>
												<span className='text-gray-400'>No Cover</span>
											</div>
										)}
										{songDetails?.audio_url && (
											<div
												className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer'
												onClick={togglePlay}>
												{isPlaying ? (
													<PauseCircleFilled className='!text-white text-6xl' />
												) : (
													<PlayCircleFilled className='!text-white text-6xl' />
												)}
											</div>
										)}
									</div>
								)}
							</div>

							<div className='lg:w-2/3 space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='bg-gray-50 p-4 rounded-lg shadow-sm'>
										<div className='flex items-center space-x-2'>
											<TagOutlined className='text-gray-500' />
											<p className='text-sm text-gray-500 font-medium'>Genre</p>
										</div>
										<p className='text-lg font-medium mt-1'>
											{songDetails?.genre?.map((g) => g.name).join(", ") ||
												"N/A"}
										</p>
									</div>
									<div className='bg-gray-50 p-4 rounded-lg shadow-sm'>
										<div className='flex items-center space-x-2'>
											<ClockCircleOutlined className='text-gray-500' />
											<p className='text-sm text-gray-500 font-medium'>
												Duration
											</p>
										</div>
										<p className='text-lg font-medium mt-1'>
											{formatTime(songDetails?.duration)}
										</p>
									</div>
									<div className='bg-gray-50 p-4 rounded-lg shadow-sm'>
										<div className='flex items-center space-x-2'>
											<CalendarOutlined className='text-gray-500' />
											<p className='text-sm text-gray-500 font-medium'>
												Released
											</p>
										</div>
										<p className='text-lg font-medium mt-1'>
											{formatDate(songDetails?.released_at)}
										</p>
									</div>
									<div className='bg-gray-50 p-4 rounded-lg shadow-sm'>
										<div className='flex items-center space-x-2'>
											<CheckCircleOutlined className='text-gray-500' />
											<p className='text-sm text-gray-500 font-medium'>
												Approved
											</p>
										</div>
										<p className='text-lg font-medium mt-1'>
											{formatDate(songDetails?.approved_at)}
										</p>
									</div>
								</div>

								{songDetails?.audio_url && (
									<div className='mt-6 bg-gray-100 rounded-lg p-4'>
										<div className='flex items-center space-x-4 mb-3'>
											<button
												onClick={togglePlay}
												className='text-3xl focus:outline-none cursor-pointer'>
												{isPlaying ? (
													<PauseCircleFilled className='text-black' />
												) : (
													<PlayCircleFilled className='text-black' />
												)}
											</button>
											<div className='text-sm font-medium'>
												{formatTime(currentTime)} / {formatTime(duration)}
											</div>
											<div className='ml-auto flex items-center space-x-2'>
												<Tooltip title='Download'>
													<Button
														icon={<DownloadOutlined />}
														onClick={handleDownloadMedia}
														size='small'
														type='text'
													/>
												</Tooltip>
											</div>
										</div>
										<div className='flex items-center gap-2 w-full'>
											<input
												type='range'
												min='0'
												max={duration || 0}
												step='0.01'
												value={currentTime}
												onChange={handleSeek}
												className='w-full h-1.5 accent-black cursor-pointer'
											/>
										</div>
										<audio
											ref={audioRef}
											src={songDetails.audio_url}
											onTimeUpdate={handleTimeUpdate}
											onEnded={handleEnded}
											onLoadedMetadata={handleTimeUpdate}
											type='audio/mp3'
										/>
										<div className='flex items-center gap-2 mt-3'>
											<VolumeIcon
												volume={
													volume >= 0.5 ? "high" : volume > 0 ? "medium" : "off"
												}
												width='16'
												height='16'
												className='text-black/50 hover:text-black cursor-pointer'
												onClick={toggleMute}
											/>
											<input
												type='range'
												min='0'
												max='1'
												step='0.01'
												value={volume}
												onChange={handleVolumeChange}
												className='outline-none border-none h-1.5 accent-black cursor-pointer'
											/>
											<div
												className={`transition-opacity duration-300 ${
													showVolume ? "opacity-100" : "opacity-0"
												}`}>
												<p className='text-sm'>{`${Math.floor(
													volume * 100
												)}%`}</p>
											</div>
										</div>
									</div>
								)}

								<div className='mt-6 pt-4 border-t border-gray-200'>
									{(songDetails?.audio_url || songDetails?.video_url) && (
										<div className='flex items-center justify-between mb-2'>
											<span className='text-sm font-medium text-gray-500'>
												{isVideo ? "Video File:" : "Audio File:"}
											</span>
											<button
												className='cursor-pointer hover:underline text-sm'
												onClick={handleDownloadMedia}>
												Download
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default memo(SongModal);
