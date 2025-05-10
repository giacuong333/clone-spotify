import AlbumAndArtistItem from "../AlbumAndArtistItem";

const AlbumAndArtistList = ({ list, type }) => {
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
