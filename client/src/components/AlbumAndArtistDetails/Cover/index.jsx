import React from "react";
import VerifiedBadge from "../../VerifiedBadge";

const Cover = ({ imageUrl, name, isVerified, monthlyListeners }) => {
  return (
    <div className='relative h-[40vh] max-h-none w-full'>
      {/* Cover */}
      <div className='w-full h-full'>
        <img
          src={imageUrl}
          alt='Cover'
          className='w-full h-full object-cover object-top'
        />
        {/* Overlay on the cover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent'></div>
      </div>

      <div className='flex items-end py-10 absolute bottom-0 left-0 w-full h-full'>
        {/* Content on the cover */}
        <div className='2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-10 flex flex-col gap-4'>
          {isVerified && (
            <span className='flex items-center gap-2'>
              <VerifiedBadge
                width='22'
                height='22'
                className='text-[#4cb3ff] bg-white rounded-full'
              />
              <p className='text-white'>Verified Artist</p>
            </span>
          )}
          <p className='text-white text-8xl font-bold leading-20 font-sans'>
            {name}
          </p>
          <p className='text-white text-lg mt-4'>
            {monthlyListeners} monthly listeners
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cover;
