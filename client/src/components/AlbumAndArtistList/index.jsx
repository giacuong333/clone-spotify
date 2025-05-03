import AlbumAndArtistItem from "../AlbumAndArtistItem";

const AlbumAndArtistList = ({ list, type }) => {
	return (
		<ul className='grid grid-flow-col'>
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
