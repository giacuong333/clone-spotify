import { lazy, Suspense, useRef } from "react";
import { Spin } from "antd";
import AlbumAndArtistWrap from "../AlbumAndArtistWrap";

const Header = lazy(() => import("./Header"));
const Cover = lazy(() => import("./Cover"));
const MainContent = lazy(() => import("./MainContent"));

const songList = [
  {
    id: 1,
    imageUrl: "",
    name: "Mất Kết Nối",
    listeners: "25,661,983",
    duration: "3:27",
  },
  {
    id: 2,
    imageUrl: "",
    name: "Tràn Bộ Nhớ",
    listeners: "9,378,924",
    duration: "3:30",
  },
  {
    id: 3,
    imageUrl: "",
    name: "HÀO QUANG(feat.RHYDER, Dương Mic & Pháp Kiều) HÀO QUANG(feat.RHYDER, Dương Mic & Pháp Kiều)",
    listeners: "2,345,677",
    duration: "4:12",
  },
  {
    id: 4,
    imageUrl: "",
    name: "Pin Dự Phòng",
    listeners: "21,357,833",
    duration: "3:18",
  },
  {
    id: 5,
    imageUrl: "",
    name: "LÀN ƯU TIÊN",
    listeners: "15,113,644",
    duration: "4:05",
  },
  {
    id: 6,
    imageUrl: "",
    name: "Yêu Em 2 Ngày",
    listeners: "3,876,990",
    duration: "2:52",
  },
];

const list = [
  {
    id: 1,
    name: "Duong Domic",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 2,
    name: "HIEUTHUHAI",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 3,
    name: "Sơn Tùng M-TP",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 4,
    name: "ANH TRAI 'SAY HI'",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 5,
    name: "ERIK",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
  {
    id: 6,
    name: "buitruonglinh",
    type: "Artist",
    image: "https://i.scdn.co/image/ab67616100005174352d5672d70464e67c3ae963",
  },
];

const AlbumAndArtistDetails = () => {
  const contentRef = useRef(null);

  return (
    <Suspense
      fallback={
        <Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
      }>
      <div className='w-full h-full overflow-y-auto' ref={contentRef}>
        <Header name='Trung' contentRef={contentRef} />
        <Cover
          name='test'
          isVerified={true}
          monthlyListeners='1,897,666'
          imageUrl='https://image-cdn-ak.spotifycdn.com/image/ab6761860000eab17344b5f36a6a602d3e6eb362'
        />
        <MainContent songList={songList} />
        <div className='mt-10 flex flex-col gap-10'>
          <AlbumAndArtistWrap
            title='Popular artists'
            list={list}
            type='artist'
          />
          <AlbumAndArtistWrap title='Discography' list={list} type='artist' />
          <AlbumAndArtistWrap
            title='Featuring Dương Domic'
            list={list}
            type='artist'
          />
        </div>
      </div>
    </Suspense>
  );
};

export default AlbumAndArtistDetails;
