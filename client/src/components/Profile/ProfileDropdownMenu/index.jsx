import { useState, useRef, useEffect } from "react";
import { FiMoreHorizontal, FiEdit2, FiCopy } from "react-icons/fi";
import EditProfileModal from "../EditProfileModal"; // Adjust the path as needed

const ProfileDropdownMenu = ({ user, setUser }) => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef(null);
	const [showEditModal, setShowEditModal] = useState(false);

	const handleSave = (formData) => {
		// Gọi API update ở đây
		console.log("Updated form data", formData);
		// axios.patch(`/api/users/${user.id}`, formData);
	};

	// Đóng menu khi click ra ngoài
	useEffect(() => {}, []);

	const handleCopy = () => {
		navigator.clipboard.writeText(window.location.href);
		alert("Link copied!");
	};

	return (
		<div className='relative flex items-center' ref={menuRef}>
			<FiMoreHorizontal
				className='w-8 h-8 text-neutral-400 hover:text-white cursor-pointer'
				onClick={() => {
					setOpen(!open);
				}}
			/>

			{open && (
				<div className='absolute top-0 left-[calc(100%+8px)] w-48 bg-neutral-800 rounded-md shadow-lg z-50 py-2 text-white text-sm'>
					<button className='flex items-center gap-2 w-full px-4 py-2 hover:bg-neutral-700 transition'>
						<FiEdit2
							className='w-4 h-4'
							onClick={() => setShowEditModal(true)}
						/>
						Edit profile
					</button>
					<button
						onClick={handleCopy}
						className='flex items-center gap-2 w-full px-4 py-2 hover:bg-neutral-700 transition'>
						<FiCopy className='w-4 h-4' />
						Copy link to profile
					</button>
					<EditProfileModal
						open={showEditModal}
						onClose={() => setShowEditModal(false)}
						user={user}
						onSave={handleSave}
					/>
				</div>
			)}
		</div>
	);
};

export default ProfileDropdownMenu;
