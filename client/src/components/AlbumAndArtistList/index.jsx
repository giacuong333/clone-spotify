import AlbumAndArtistItem from "../AlbumAndArtistItem";

const AlbumAndArtistList = ({ list, type }) => {
	if (list?.length === 0) {
		if (type === "album") return <p className='text-white'>No playlist</p>;
		if (type === "user") return <p className='text-white'>No artist</p>;
		if (type === "song") return <p className='text-white'>No song</p>;
	}

	return (
		<ul className='flex flex-row flex-wrap gap-0 justify-start'>
			{list?.map((item, index) => {
				return (
					<AlbumAndArtistItem
						key={item?.id || index}
						item={item}
						type={type}
						index={index}
						list={list}
					/>
				);
			})}
		</ul>
	);
};

export default AlbumAndArtistList;
