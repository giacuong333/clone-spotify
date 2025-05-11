const formatTotalDuration = (songs) => {
	if (!songs || !songs.length) return "0 min";

	const totalSeconds = songs.reduce((total, item) => {
		return total + (item.song?.duration || 0);
	}, 0);

	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes} min ${seconds} sec`;
};

export default formatTotalDuration;
