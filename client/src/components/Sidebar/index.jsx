import { useState } from "react";
import Header from "./Header";
import PlaylistList from "./PlaylistList";
import PlaylistModal from "./PlaylistModal";

const Sidebar = () => {
	const [popupModal, setPopupModal] = useState(false);

	return (
		<div className='flex flex-col bg-[#121212] rounded-lg w-full min-h-screen max-h-screen overflow-hidden'>
			<Header onPopupModal={() => setPopupModal(true)} />
			<PlaylistList />
			{popupModal && (
				<PlaylistModal
					toggle={popupModal}
					onClose={() => setPopupModal(false)}
				/>
			)}
		</div>
	);
};

export default Sidebar;
