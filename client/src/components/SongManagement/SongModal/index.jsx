import React, { memo } from "react";
import { CloseOutlined } from "@ant-design/icons";
import Overlay from "../../Overlay";
import { Spin } from "antd";

const SongModal = ({
	toggle,
	setToggle,
	songDetails,
	loadingFetchSongDetails,
}) => {
	return (
		<>
			<Overlay toggle={toggle} setToggle={setToggle} />
			{loadingFetchSongDetails ? (
				<Spin spinning tip='Loging In...' fullscreen size='large'></Spin>
			) : (
				<section
					className={`lg:w-1/2 xl:w-1/3 w-full h-auto fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-4 overflow-auto ${
						toggle
							? "pointer-events-auto opacity-100"
							: "pointer-events-none opacity-0"
					}`}>
					<div className='text-end'>
						<CloseOutlined
							className='text-xl p-1 hover:bg-black/5'
							onClick={() => setToggle(false)}
						/>
					</div>
					<div className='mt-4'>
						<h2 className='text-2xl font-bold mb-4'>Song Details</h2>
						<div className='space-y-2'>
							<p>
								<strong>Title:</strong> {songDetails?.title || "N/A"}
							</p>
							<p>
								<strong>Genre:</strong>{" "}
								{songDetails?.genre?.map((g) => g.name).join(", ") || "N/A"}
							</p>
							<p>
								<strong>User:</strong> {songDetails?.user?.name || "N/A"}
							</p>
							<p>
								<strong>Duration:</strong> {songDetails?.duration || "N/A"}{" "}
								seconds
							</p>
							<p>
								<strong>Released At:</strong>{" "}
								{songDetails?.released_at
									? new Date(songDetails?.released_at).toLocaleDateString()
									: "N/A"}
							</p>
							<p>
								<strong>Approved At:</strong>{" "}
								{songDetails?.approved_at
									? new Date(songDetails?.approved_at).toLocaleDateString()
									: "N/A"}
							</p>
							<p>
								<strong>File URL:</strong>{" "}
								{songDetails?.file_url ? (
									<a
										href={songDetails?.file_url}
										target='_blank'
										rel='noopener noreferrer'>
										{songDetails?.file_url}
									</a>
								) : (
									"N/A"
								)}
							</p>
							<p>
								<strong>Cover URL:</strong>{" "}
								{songDetails?.cover_url ? (
									<a
										href={songDetails?.cover_url}
										target='_blank'
										rel='noopener noreferrer'>
										{songDetails?.cover_url}
									</a>
								) : (
									"N/A"
								)}
							</p>
						</div>
					</div>
				</section>
			)}
		</>
	);
};

export default memo(SongModal);
