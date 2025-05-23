import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { notify } from "../../components/Toast";
import { useListenedAt } from "../ListenedAt";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
	const [currentSong, setCurrentSong] = useState(null);
	const [currentSongIndex, setCurrentSongIndex] = useState(0);
	const [songList, setSongList] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentPlaylistId, setCurrentPlaylistId] = useState(null);

	const { isAuthenticated } = useAuth();
	const { isSaved, saveListenedAt, resetSaveStatus } = useListenedAt();

	// Track when a song starts playing
	useEffect(() => {
		// Only save when a song starts playing and hasn't been saved yet
		if (isPlaying && currentSong && !isSaved && currentSong.id) {
			saveListenedAt(currentSong.id);
		}
	}, [currentSong, isPlaying, isSaved, saveListenedAt]);

	// Reset save status when song changes
	useEffect(() => {
		if (currentSong) {
			resetSaveStatus();
		}
	}, [currentSong, resetSaveStatus]);

	const playSong = (song, songs, index = null, playlistId = null) => {
		if (!isAuthenticated) {
			notify("Log in to listen", "error");
			return;
		}

		if (!song?.audio_url || !songs?.length) {
			notify("Invalid song or playlist", "error");
			setIsPlaying(false);
			return;
		}

		setCurrentSong(song);
		setSongList(songs);
		setCurrentPlaylistId(playlistId);

		if (index !== null) {
			setCurrentSongIndex(index);
		} else if (songs && songs.length) {
			const songIndex = songs.findIndex((s) => s.id === song.id);
			setCurrentSongIndex(songIndex >= 0 ? songIndex : 0);
		}
		setIsPlaying(true);
	};

	const togglePlay = () => {
		if (!currentSong?.audio_url) {
			notify("No song selected", "error");
			return;
		}
		setIsPlaying(!isPlaying);
	};

	const playNext = (shuffle = false) => {
		if (!songList.length) {
			return null;
		}
		let nextIndex;
		if (shuffle) {
			const randomIndex = Math.floor(Math.random() * songList.length);
			nextIndex = randomIndex;
		} else {
			nextIndex = (currentSongIndex + 1) % songList.length;
		}
		setCurrentSongIndex(nextIndex);
		setCurrentSong(songList[nextIndex]);
		setIsPlaying(true);
		return songList[nextIndex];
	};

	const playPrevious = () => {
		if (!songList.length) {
			return null;
		}
		const prevIndex =
			currentSongIndex === 0 ? songList.length - 1 : currentSongIndex - 1;
		setCurrentSongIndex(prevIndex);
		setCurrentSong(songList[prevIndex]);
		setIsPlaying(true);
		return songList[prevIndex];
	};

	return (
		<PlayerContext.Provider
			value={{
				currentSong,
				currentSongIndex,
				currentPlaylistId,
				songList,
				isPlaying,
				setIsPlaying,
				playSong,
				togglePlay,
				playNext,
				playPrevious,
			}}>
			{children}
		</PlayerContext.Provider>
	);
};

export const usePlayer = () => useContext(PlayerContext);

export default PlayerProvider;
