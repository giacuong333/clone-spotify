const Cover = ({ user, playlistCount = 0, songCount = 0 }) => {
	
	return (
		<div className='flex items-center p-6 bg-gradient-to-b from-[#2a6e7f] to-[#0f2a2e] rounded-xl text-white'>
			{/* Avatar */}
			<img
				src={
					user?.image ||
					"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
				}
				alt={`${name}'s avatar`}
				className='w-50 h-50 rounded-full object-cover shadow-lg'
			/>

			{/* Info */}
			<div className='ml-6 w-fit'>
				<p className='text-sm text-white/80 mb-1'>Profile</p>
				<h1 className='text-6xl font-bold truncate w-full max-w-md overflow-ellipsis'>{user?.name || "Demo"}</h1>
				<p className='mt-5 text-white/90 text-sm'>
					{playlistCount} Public Playlist &bull; {songCount} Songs
				</p>
				<p className='mt-2 text-white/100 text-md'>
					{user?.bio ||
						"This user is too lazy to write a bio. Please come back later."}
				</p>
			</div>
		</div>
	);
};

export default Cover;
