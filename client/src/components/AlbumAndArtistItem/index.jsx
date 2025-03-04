import React from "react";

const AlbumAndArtistItem = ({ item, type }) => {
  return (
    <li className='w-full h-full'>
      <div className='w-full flex flex-col items-start justify-center cursor-pointer hover:bg-neutral-800 p-4 rounded-md'>
        {/* Image */}
        <div className='w-32 h-32 2xl:w-full 2xl:h-44'>
          <img
            src={item?.image}
            alt={item?.name}
            className={`w-full h-full object-center object-cover ${
              type === "album" ? "rounded-lg" : "rounded-full"
            }`}
          />
        </div>

        {/* Texts */}
        <div className='mt-2'>
          <p className='hover:underline text-white truncate'>{item?.name}</p>
          <p className='text-gray-400 text-sm'>{item?.type}</p>
        </div>
      </div>
    </li>
  );
};

export default AlbumAndArtistItem;
