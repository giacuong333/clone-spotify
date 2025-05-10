import React from "react";
import SongList from "../SongList";

const SongListWrap = ({ songList, title, canHover = false }) => {
	return (
		<div className="mx-auto"> 
			<p
				className={`text-white text-2xl font-bold font-sans mb-6 ${
					canHover ? "hover:underline" : ""
				}`}>
				{title}
			</p>
			<SongList songList={songList} />
		</div>
	);
};

export default React.memo(SongListWrap);
