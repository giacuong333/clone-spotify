import { useState } from "react";
import Header from "./Header";
import PlaylistList from "./PlaylistList";
import PlaylistModal from "./PlaylistModal";

const Sidebar = () => {
	const [popupModal, setPopupModal] = useState(false);
	const [playlistInfo, setPlaylistInfo] = useState({
		id: "",
		name: "",
		desc: "",
		cover: "",
	});

	const open = () => {
		setPopupModal(true);
	};

	const close = () => {
		setPopupModal(false);
	};

	const clear = () => {
		setPlaylistInfo({ id: "", name: "", desc: "", cover: "" });
	};

	return (
		<div className='flex flex-col bg-[#121212] rounded-lg w-full min-h-screen max-h-screen overflow-hidden'>
			<Header onPopupModal={open} />
			<PlaylistList onPopupModal={open} onPlaylistInfo={setPlaylistInfo} />
			{popupModal && (
				<PlaylistModal
					toggle={popupModal}
					onClose={close}
					playlistInfo={playlistInfo}
					clearPlaylistInfo={clear}
				/>
			)}
		</div>
	);
};

export default Sidebar;
