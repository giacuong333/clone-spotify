import React from "react";

const PlayerContext = React.createContext();

const PlayerProvider = ({ children }) => {
	const [currentSong, setCurrentSong] = React.useState(null);
	const [songList, setSongList] = React.useState([]);
	const [isPlaying, setIsPlaying] = React.useState(false);

	const playSong = (song, songs) => {
		setCurrentSong(song);
		setSongList(songs);
		setIsPlaying(true);
	};

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		<PlayerContext.Provider
			value={{
				currentSong,
				songList,
				isPlaying,
				playSong,
				togglePlay,
			}}>
			{children}
		</PlayerContext.Provider>
	);
};

export const usePlayer = () => React.useContext(PlayerContext);

export default PlayerProvider;
