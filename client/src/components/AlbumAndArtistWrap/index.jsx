import React from "react";
import AlbumAndArtistList from "../AlbumAndArtistList";

const AlbumAndArtistWrap = ({ title, list, type }) => {
  return (
    <div className='2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-10'>
      {/* Title */}
      <div className='flex items-center justify-between mb-4'>
        <p className='text-white text-2xl font-bold cursor-pointer hover:underline'>
          {title}
        </p>
        <p className='text-gray-400 font-bold text-sm cursor-pointer hover:underline'>
          Show all
        </p>
      </div>

      {/* List */}
      <AlbumAndArtistList list={list} type={type} />
    </div>
  );
};

export default AlbumAndArtistWrap;
