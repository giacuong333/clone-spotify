import React from "react";
import AlbumAndArtistItem from "../AlbumAndArtistItem";

const AlbumAndArtistList = ({ list, type }) => {
  return (
    <ul className='grid grid-flow-col-dense'>
      {list?.map((item) => {
        return <AlbumAndArtistItem key={item} item={item} type={type} />;
      })}
    </ul>
  );
};

export default AlbumAndArtistList;
