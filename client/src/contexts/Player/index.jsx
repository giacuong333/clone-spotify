import { createContext, useContext, useState } from "react";
import { useAuth } from "../Auth";
import { notify } from "../../components/Toast";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
	const [currentSong, setCurrentSong] = useState(null);
	const [currentSongIndex, setCurrentSongIndex] = useState(0);
	const [songList, setSongList] = useState([]);
	const [isPlaying, setIsPlaying] = useState(false);
	const { user, isAuthenticated } = useAuth();

	const playSong = (song, songs, index = null) => {
		if (!isAuthenticated) {
			notify("Log in to listen", "error");
			return;
		}

		setCurrentSong(song);
		setSongList(songs);
		if (index !== null) {
			setCurrentSongIndex(index);
		} else if (songs && songs.length) {
			const songIndex = songs.findIndex((s) => s.id === song.id);
			setCurrentSongIndex(songIndex >= 0 ? songIndex : 0);
		}
		setIsPlaying(true);
	};

	const togglePlay = () => {
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
		return songList[prevIndex];
	};

	return (
		<PlayerContext.Provider
			value={{
				currentSong,
				currentSongIndex,
				songList,
				isPlaying,
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
