const formatTime = (seconds = 0) => {
	const min = Math.floor(seconds / 60);
	const sec = Math.floor(seconds % 60);
	return `${min}:${sec < 10 ? "0" + sec : sec}`;
};

export default formatTime;
