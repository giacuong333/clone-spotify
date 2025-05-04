import { memo, useState, useEffect, useRef, useCallback } from "react";
import {
	CloseOutlined,
	PlayCircleFilled,
	PauseCircleFilled,
	TagOutlined,
	ClockCircleOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import Overlay from "../../Overlay";
import VolumeIcon from "../../Icons/VolumnIcon";
import { Spin } from "antd";
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

	const previousVolumeRef = useRef(0.5);
	const audioRef = useRef(null);
	const progressBarRef = useRef(null);
	const volumeTimerRef = useRef(null);
	const { handleDownload } = useSong();

	// Handle play/pause
	const togglePlay = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play().catch((error) => {
					console.error("Playback failed:", error);
				});
			}
			setIsPlaying(!isPlaying);
		}
	};

	// Update progress bar
	const updateTime = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
			setDuration(audioRef.current.duration || songDetails?.duration || 0);
		}
	};

	// Set progress when clicking on progress bar
	const setProgress = (e) => {
		e.preventDefault();
		if (
			progressBarRef.current &&
			audioRef.current &&
			audioRef.current.duration &&
			audioRef.current.readyState >= 2
		) {
			const rect = progressBarRef.current.getBoundingClientRect();
			const clickPosition = e.clientX - rect.left;
			const width = rect.width;
			const progressPercentage = Math.max(
				0,
				Math.min(1, clickPosition / width)
			);
			const newTime = progressPercentage * audioRef.current.duration;
			audioRef.current.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	// Handle volume change
	const handleVolumeChange = useCallback((e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		previousVolumeRef.current = newVolume;
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}

		// Show volume indicator
		setShowVolume(true);

		// Clear any existing timer
		if (volumeTimerRef.current) {
			clearTimeout(volumeTimerRef.current);
		}

		// Set timer to hide volume indicator after 2 seconds
		volumeTimerRef.current = setTimeout(() => {
			setShowVolume(false);
		}, 1000);
	}, []);

	// Calculate progress percentage
	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

	// Reset playing state when modal closes
	useEffect(() => {
		if (!toggle && isPlaying && audioRef.current) {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	}, [toggle, isPlaying]);

	// Set initial volume when audio element is created
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [songDetails?.audio_url, volume]);

	// Clean up volume timer on unmount
	useEffect(() => {
		return () => {
			if (volumeTimerRef.current) {
				clearTimeout(volumeTimerRef.current);
			}
		};
	}, []);

	const handleDownloadSong = (event) => {
		handleDownload(
			event,
			songDetails?.audio_url,
			songDetails?.title,
			songDetails?.user?.name
		);
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
					{/* Hidden audio element (Customize the control) */}
					{songDetails?.audio_url && (
						<audio
							ref={audioRef}
							src={songDetails.audio_url}
							onTimeUpdate={updateTime}
							onLoadedMetadata={updateTime}
							onEnded={() => setIsPlaying(false)}
							preload='metadata'
						/>
					)}

					{/* Header with cover image as background */}
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
								<h2 className='text-3xl font-bold text-black/70'>
									{songDetails?.title || "Song Details"}
								</h2>
								<button
									className='bg-white/20 text-white hover:bg-white/50 rounded-md py-2 px-2.5 transition-colors cursor-pointer'
									onClick={() => setToggle(false)}>
									<CloseOutlined className='text-lg !text-black/70' />
								</button>
							</div>
							<p className='text-sm opacity-90 mt-1 text-black/70'>
								{songDetails?.user?.name || "Unknown Artist"}
							</p>
						</div>
					</div>

					{/* Album cover and details */}
					<div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>
						<div className='flex flex-col lg:flex-row gap-6'>
							{/* Album Cover with Play Button Overlay */}
							<div className='lg:w-1/3 relative group'>
								{songDetails?.cover_url ? (
									<div className='relative'>
										<img
											src={songDetails.cover_url}
											alt={songDetails.title || "Album cover"}
											className='w-full aspect-square object-cover rounded-lg shadow-md group-hover:border-2 group-hover:border-black transition-all'
										/>
										{songDetails?.audio_url && (
											<div
												className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer'
												onClick={togglePlay}>
												{isPlaying ? (
													<PauseCircleFilled className='text-white text-6xl' />
												) : (
													<PlayCircleFilled className='text-white text-6xl' />
												)}
											</div>
										)}
									</div>
								) : (
									<div className='w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center'>
										<span className='text-gray-400'>No Cover</span>
									</div>
								)}
							</div>

							{/* Details */}
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

								{/* Custom Audio Player */}
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
										</div>

										{/* Progress Bar */}
										<div
											className='h-[6px] bg-gray-300 rounded-full w-full relative cursor-pointer'
											ref={progressBarRef}
											onClick={setProgress}>
											<div
												className='absolute h-full bg-black rounded-full'
												style={{ width: `${progressPercentage}%` }}></div>
											<div
												className='absolute h-3 w-3 bg-black rounded-full -top-[3px]'
												style={{
													left: `${progressPercentage}%`,
													transform: "translateX(-50%)",
												}}></div>
										</div>

										{/* Volume Control */}
										<div>
											<div className='flex items-center gap-2 mt-3'>
												<VolumeIcon
													volume={`${
														volume >= 0.5
															? "high"
															: volume < 0.5 && volume > 0
															? "medium"
															: "off"
													}`}
													width='16'
													height='16'
													className='text-black/50 hover:text-black cursor-pointer'
													onClick={() => setVolume(0)}
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
													<p className='text-sm'>{Math.floor(volume * 100)}</p>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Links */}
								<div className='mt-6 pt-4 border-t border-gray-200'>
									{songDetails?.audio_url && (
										<div className='flex items-center justify-between mb-2'>
											<span className='text-sm font-medium text-gray-500'>
												File URL:
											</span>
											<button
												className='cursor-pointer hover:underline'
												onClick={handleDownloadSong}>
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
