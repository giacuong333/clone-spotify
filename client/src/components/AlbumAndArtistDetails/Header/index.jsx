import React, { useEffect, useState } from "react";
import { Button } from "antd";
import PlayIcon from "../../PlayIcon";

const Header = ({ name, contentRef }) => {
  const [isStickedHeader, setIsStickedHeader] = useState(false);

  useEffect(() => {
    if (!contentRef?.current) return;

    const stickHeader = () => {
      const coverHeight = 432;

      if (contentRef.current.scrollTop > coverHeight) {
        setIsStickedHeader(true);
      } else {
        setIsStickedHeader(false);
      }
    };

    const currentContentRef = contentRef.current;
    currentContentRef.addEventListener("scroll", stickHeader);

    return () => {
      contentRef &&
        currentContentRef.removeEventListener("scroll", stickHeader);
    };
  }, [contentRef]);

  return (
    <header
      className={`absolute top-0 left-0 w-full h-16 bg-[#253741] z-20 transition-transform duration-500 ${
        isStickedHeader ? "translate-y-0" : "-translate-y-full"
      }`}>
      <div className='2xl:max-w-10/12 w-full h-full mx-auto 2xl:px-0 px-10'>
        <div className='h-full w-full flex flex-col justify-center'>
          {/* Play button */}
          <div className='flex items-center justify-start gap-2'>
            <div
              className='
                size-12 bg-[#1ED760]                 
                shadow-lg rounded-full flex items-center justify-center 
                hover:bg-[#3BE477] hover:scale-[1.03] 
                '>
              <Button
                type='primary'
                icon={<PlayIcon width='30' height='30' />}
                className='!rounded-full !text-3xl !text-center !mx-auto !w-full !bg-transparent !text-black'
              />
            </div>
            <p className='text-white text-2xl font-bold'>{name}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
