import React, { lazy } from "react";

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
    name: "HÀO QUANG(feat.RHYDER, Dương Mic & Pháp Kiều)",
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

const AlbumAndArtistDetails = () => {
  return (
    <div>
      <Header />
      <Cover
        name='Dương Domic'
        isVerified={true}
        monthlyListeners='1,897,666'
        imageUrl='https://image-cdn-ak.spotifycdn.com/image/ab6761860000eab17344b5f36a6a602d3e6eb362'
      />
      <MainContent />
    </div>
  );
};

export default AlbumAndArtistDetails;
