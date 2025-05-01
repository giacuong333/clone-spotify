import React from "react";

import PlusCircleIcon from "../PlusCircleIcon";
import NextIcon from "../NextIcon";
import PrevIcon from "../PrevIcon";
import ShuffleIcon from "../ShuffleIcon";
import VolumnIcon from "../VolumnIcon";
import SkipForwardIcon from "../SkipForwardIcon";
import PlayIcon from "../PlayIcon";
import PauseIcon from "../PauseIcon";
import { usePlayer } from "../../contexts/Player";

const NowPlayingBar = () => {
	const [progress, setProgress] = React.useState(0);
	const [currentTime, setCurrentTime] = React.useState("0:00");
	const [duration, setDuration] = React.useState("0:00");
	const [volume, setVolume] = React.useState(0.5);
	const [isRepeating, setIsRepeating] = React.useState(false);
	const [isShuffled, setIsShuffled] = React.useState(false);
	const [currentSongIndex, setCurrentSongIndex] = React.useState(0);
	const { currentSong, songList, isPlaying, togglePlay, playSong } =
		usePlayer();

	const audioRef = React.useRef(null);
	const progressBarRef = React.useRef(null);
	const volumeBarRef = React.useRef(null);

	// Reset the song when clicking on a new song
	React.useEffect(() => {
		if (currentSong) {
			audioRef.current.src = currentSong.url;
			setProgress(0);
			setCurrentTime("0:00");
			audioRef.current.load();

			const index = songList.findIndex((s) => s.url === currentSong.url);
			setCurrentSongIndex(index >= 0 ? index : 0);

			if (isPlaying) {
				audioRef.current
					.play()
					.catch((error) => console.error("Playback error:", error));
			}
		}
	}, [currentSong, isPlaying, songList]);

	React.useEffect(() => {
		const audio = audioRef.current;

		const updateProgress = () => {
			const duration = audio.duration;
			const current = audio.currentTime;
			setProgress((current / duration) * 100);
			setCurrentTime(formatTime(current));
		};

		const setAudioDuration = () => {
			setDuration(formatTime(audio.duration));
		};

		const handleSongEnd = () => {
			if (isRepeating) {
				audioRef.current.currentTime = 0;
				audioRef.current.play();
			} else {
				handleNext();
			}
		};

		audio.addEventListener("timeupdate", updateProgress);
		audio.addEventListener("loadedmetadata", setAudioDuration);
		audio.addEventListener("ended", handleSongEnd);

		if (isPlaying) {
			audio.play().catch((error) => console.error("Playback error:", error));
		} else {
			audio.pause();
		}

		return () => {
			audio.removeEventListener("timeupdate", updateProgress);
			audio.removeEventListener("loadedmetadata", setAudioDuration);
			audio.removeEventListener("ended", handleSongEnd);
		};
	}, [isPlaying, currentSong, currentSongIndex, isRepeating, handleNext]);

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	const toggleShuffle = () => {
		setIsShuffled(!isShuffled);
	};

	const toggleReplay = () => {
		setIsRepeating(!isRepeating);
		audioRef.current.loop = !isRepeating;
	};

	const handleVolumnChange = (event) => {
		const volumeBar = volumeBarRef.current;
		const rect = volumeBar.getBoundingClientRect();

		const clickedPosition = event.clientX - rect.left;
		const newVolume = clickedPosition / rect.width;

		audioRef.current.volume = Math.max(0, Math.min(1, newVolume));

		setVolume(newVolume);
	};

	const handleSeek = (event) => {
		const progressBar = progressBarRef.current;
		const rect = progressBar.getBoundingClientRect();

		const clickedPosition = event.clientX - rect.left;
		const newProgress = (clickedPosition / rect.width) * 100;

		const seekTime = (newProgress / 100) * audioRef.current.duration;
		audioRef.current.currentTime = seekTime;
		setProgress(newProgress);
	};

	function handleNext() {
		if (!songList.length) {
			return;
		}

		let nextIndex;
		if (isShuffled) {
			nextIndex = Math.floor(Math.random() * songList.length);
		} else {
			nextIndex = (currentSongIndex + 1) % songList.length;
		}

		setCurrentSongIndex(nextIndex);

		playSong(songList[nextIndex], songList);
	}

	const handlePrev = () => {
		if (!songList.length) {
			return;
		}

		let prevIndex =
			currentSongIndex === 0 ? songList.length - 1 : currentSongIndex - 1;

		setCurrentSongIndex(prevIndex);

		playSong(songList[prevIndex], songList);
	};

	return (
		<section className='bg-black h-20 w-full'>
			<audio ref={audioRef} />
			<div className='grid grid-cols-4 h-full'>
				{/* Left */}
				<div className='flex items-center gap-3 w-full'>
					<div className='w-14 h-14 rounded overflow-hidden'>
						<img
							src='https://i.scdn.co/image/ab67616d00004851e1379f9837c5cf0a33365ffb'
							alt='Song thumbnail'
							className='w-full h-full object-center object-cover'
						/>
					</div>
					<div>
						<p className='hover:underline text-white uppercase cursor-pointer'>
							UH VEI VEI
						</p>
						<p className='hover:underline text-white/50 uppercase hover:text-white  text-xs cursor-pointer'>
							KREZUS
						</p>
					</div>
					<div>
						<PlusCircleIcon className='w-4 h-4 text-white/75 cursor-pointer hover:text-white' />
					</div>
				</div>

				{/* Center */}
				<div className='col-span-2 w-full flex flex-col justify-center items-center gap-2'>
					<div className='flex items-center gap-8'>
						<ShuffleIcon
							width='16'
							height='16'
							className={`text-white/50 hover:text-white cursor-pointer ${
								isShuffled ? "!text-[#3BE477]" : ""
							}`}
							onClick={toggleShuffle}
						/>
						<PrevIcon
							width='16'
							height='16'
							className='text-white/50 hover:text-white cursor-pointer'
							onClick={handlePrev}
						/>
						{isPlaying ? (
							<PlayIcon
								width='32'
								height='32'
								className='bg-white rounded-full p-1.5 hover:scale-[1.05] text-black hover:bg-white/90 cursor-pointer'
								onClick={togglePlay}
							/>
						) : (
							<PauseIcon
								width='32'
								height='32'
								className='p-2 text-black hover:bg-white/90 cursor-pointer'
								onClick={togglePlay}
							/>
						)}
						<NextIcon
							width='16'
							height='16'
							className='text-white/50 hover:text-white cursor-pointer'
						/>
						<SkipForwardIcon
							width='16'
							height='16'
							className={`text-white/50 hover:text-white cursor-pointer ${
								isRepeating ? "!text-[#3BE477]" : ""
							}`}
							onClick={toggleReplay}
						/>
					</div>
					<div className='flex items-center justify-center gap-2 w-full px-20'>
						<p className='text-white/70 text-xs'>{currentTime}</p>
						<div
							ref={progressBarRef}
							className='h-1 w-full rounded-full bg-white/50 group cursor-pointer'
							onClick={handleSeek}>
							<div
								className='w-1/2 h-full rounded-full bg-white group-hover:bg-[#3BE477] relative'
								style={{ width: `${progress}%` }}>
								<div className='group-hover:block hidden absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white w-3 h-3 rounded-full'></div>
							</div>
						</div>
						<p className='text-white/70 text-xs'>{duration}</p>
					</div>
				</div>

				{/* Right */}
				<div className='flex items-center justify-center gap-3'>
					<VolumnIcon
						volume={`${
							volume >= 0.5
								? "high"
								: volume < 0.5 && volume > 0
								? "medium"
								: "off"
						}`}
						width='16'
						height='16'
						className='text-white/50 hover:text-white cursor-pointer'
						onClick={() => setVolume(0)}
					/>
					<div
						className='h-1 w-1/4 rounded-full bg-white/50'
						ref={volumeBarRef}
						onClick={handleVolumnChange}>
						<div className='h-1 w-full rounded-full bg-white/50 group cursor-pointer'>
							<div
								className='w-1/2 h-full rounded-full bg-white group-hover:bg-[#3BE477] relative'
								style={{ width: `${volume * 100}%` }}>
								<div className='group-hover:block hidden absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-white w-3 h-3 rounded-full'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default NowPlayingBar;
