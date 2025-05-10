import React from "react";
import Overlay from "../../Components/Overlay";

const ConfirmPopup = ({
	toggle,
	setToggle,
	onOk,
	onCancel,
	title,
	message,
	okButtonText = "OK",
	cancelButtonText = "Cancel",
}) => {
	return (
		<>
			<Overlay toggle={toggle} setToggle={onCancel} />
			<div
				className={`${
					toggle
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				} fixed inset-0 z-30 flex items-center justify-center transition`}>
				<div className='flex flex-col items-start bg-white rounded-lg shadow-lg p-6 w-96 transform transition-all scale-95'>
					<p className='font-semibold text-lg'>{title}</p>
					<p className='text-gray-700 mt-2'>{message}</p>
					<div className='w-full flex justify-end mt-4'>
						<button
							onClick={onCancel}
							className='px-4 py-2 text-[#274b609f] transition font-semibold cursor-pointer'>
							{cancelButtonText}
						</button>
						<button
							onClick={onOk}
							className='px-4 py-2 text-[#274b609f] transition font-semibold cursor-pointer'>
							{okButtonText}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ConfirmPopup;
