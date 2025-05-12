# ĐỀ TÀI: CLONE SPOTIFY

## Tổng quan

Ứng dụng web phát nhạc trực tuyến dựa trên Spotify, tái hiện các tính năng cốt lõi như phát nhạc, đăng nhạc, tải nhạc, danh sách phát và xác thực người dùng.

## Tính năng

- Đăng nhập/đăng ký người dùng
- Tìm kiếm bài hát, albums, playlists
- Tạo và quản lý playlists
- Phát nhạc với điều khiển play/pause/shuffle/repeate
- Thiết kế đáp ứng cho desktop, tablet

## Công nghệ sử dụng

- Frontend: HTML, CSS, TailwindCSS, Ant Design, JavaScript (React.js)
- Backend: Python (Django)
- Database: MongoDB

## Cài đặt

1. Sao chép kho lưu trữ: git clone https://github.com/giacuong333/clone-spotify.git
2. Di chuyển vào thư mục 'client' của dự án: cd clone-spotify/client
3. Cài đặt các gói phụ thuộc: yarn install
4. Di chuyển vào thư mục 'server' của dự án: cd clone-spotify/server
5. Tạo môi trường ảo: py -m venv venv
6. Vào môi trường ảo: \venv\Script\active
7. Cài đặt các gói phụ thuộc: pip install -r requirements.txt
8. Vào thư mục 'client', khởi động frontend:
   yarn run dev
9. Vào thư mục 'server', khởi đọng backend
   python manage.py runserver

## Sử dụng

Truy cập ứng dụng tại http://localhost:5173.
Đăng ký hoặc đăng nhập để khám phá các tính năng.
Tìm kiếm bài hát, tạo danh sách phát và thưởng thức nhạc.

## Hình ảnh giao diện

### Client:

- Login
  ![Alt text](https://drive.usercontent.google.com/download?id=1Q6vk9Dlpy9I3ILiWaWC5dW5kMF8qB1b4&authuser=0)
- Register
  ![Alt text](https://drive.usercontent.google.com/download?id=1Sxp5Uraf4E8UPvTicgTOgEB64RmUJlRW&authuser=0)
- Search
  ![Alt text](https://drive.usercontent.google.com/download?id=1DHMai2bYeHRlafpTTIBOifPq7B5yUS8F&authuser=0)
- Song, Album details
  ![Alt text](https://drive.usercontent.google.com/download?id=1-4slfP4AbvvBvqEaSRZxzbbfYNiT5sAT&authuser=0)
- Upload Song Form Step 1
  ![Alt text](https://drive.usercontent.google.com/download?id=1MIAbyi18rix-Qbb6wmdm9lP6MxeXgBl3&authuser=0)
- Upload Song Form Step 2
  ![Alt text](https://drive.usercontent.google.com/download?id=1TP4SxIMXznyUwNlmKPACiU48f9L76Hys&authuser=0)
- Upload Song Form Step 3
  ![Alt text](https://drive.usercontent.google.com/download?id=1eefqARZjz1SzE2nwz2Sdj-HO2vY5iCcl&authuser=0)
- Upload Song Form Step 4
  ![Alt text](https://drive.usercontent.google.com/download?id=1_2cWkT2htyayDwVr8pZLVuC2SE_z9KQ5&authuser=0)
- Upload Song Form Step 5
  ![Alt text](https://drive.usercontent.google.com/download?id=1zvLFq1OgGE7ONW4fBUpaOaJBnAXyPlP-&authuser=0)
- Upload Song Success
  ![Alt text](https://drive.usercontent.google.com/download?id=1lPdb6da7ztevcAjFeizmp9U9Wz-4bwrk&authuser=0)
- Chat
  ![Alt text](https://drive.usercontent.google.com/download?id=177PSyDPwA_A4dbpMVFFCXuI9JOvAwbz3&authuser=0)
- Create playlist
  ![Alt text](https://drive.usercontent.google.com/download?id=1sMXsK_WI3MPmn13x5on-iuPhJn3X0NqW&authuser=0)
- Profile
  ![Alt text](https://drive.usercontent.google.com/download?id=1W5RAD_9SFjRi39knD4Pvf5LuvRXTAs_I&authuser=0)
- Playlist details
  ![Alt text](https://drive.usercontent.google.com/download?id=1HzacF8F6cUziyIfSO3PTtRnfzwTwud8w&authuser=0)

### Server:

- Song list
  ![Alt text](https://drive.usercontent.google.com/download?id=1C0OUN69T_79uLOSBS9HbHGgQ9ZkRNyhp)
- Song details
  ![Alt text](https://drive.usercontent.google.com/download?id=17YkTyMqRkIzNemmV4wZSkmi5pzg-xn02)
- User list
  ![Alt text](https://drive.usercontent.google.com/download?id=1Y2cllaq1XMD9Uhzt6SbF01hBbEvPQkIC)
- Genre list
  ![Alt text](https://drive.usercontent.google.com/download?id=1MHsJWilMt26UBByZNYH5xMzoO0HCBwo_&authuser=0)
- Statistics
  ![Alt text](https://drive.usercontent.google.com/download?id=1BI7zvBpC1y3X0xa36qnqS4azJfDftu3O&authuser=0)

## Thành viên nhóm

- Lê Gia Cường - legiacuong789@gmail.com
- Võ Đình Văn - Dinhvanvo510@gmail.com
- Phạm Minh Trung - stsupermarik@gmail.com
- Hoàng Sỹ Khiêm - dkyytbytb5@gmail.com
- Koong Chấn Phong - koongchanphong0712@gmail.com

## Đóng góp

1. Fork kho lưu trữ.
2. Tạo nhánh tính năng (git checkout -b feature/your-feature).
3. Commit thay đổi (git commit -m 'Add your feature').
4. Push lên nhánh (git push origin feature/your-feature).
5. Tạo Pull Request.
