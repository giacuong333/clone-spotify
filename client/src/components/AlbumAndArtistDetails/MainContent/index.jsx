import React, { Suspense } from "react";
import { Button, Spin } from "antd";
import PlayIcon from "../../PlayIcon";
import ThreeDotsIcon from "../../ThreeDotsIcon";
import SongListWrap from "../../SongListWrap";

const MainContent = ({ songList }) => {
  return (
    <Suspense
      fallback={
        <Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
      }>
      <div>
        <div className='2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-10'>
          <div className='w-full py-6 flex items-center justify-start gap-6'>
            {/* Play button */}
            <div
              className='
                size-12 bg-[#1ED760] 
                hover:bg-[#3BE477] hover:scale-[1.03] 
                shadow-lg rounded-full flex items-center justify-center'>
              <Button
                type='primary'
                icon={<PlayIcon width='30' height='30' />}
                className='!rounded-full !text-3xl !text-center !mx-auto !w-full !bg-transparent !text-black'
              />
            </div>

            <Button className='!text-white !font-bold !bg-transparent !border-2 !border-gray-600 !rounded-full hover:!border-white hover:scale-[1.03] !transition-none'>
              Follow
            </Button>

            <ThreeDotsIcon className='w-8 h-8 text-neutral-400 hover:text-white cursor-pointer' />
          </div>

          <div>
            <SongListWrap songList={songList} title='Popular' />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(MainContent);
