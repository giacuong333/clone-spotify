# ĐỀ TÀI: CLONE SPOTIFY
## Tổng quan
Ứng dụng web phát nhạc trực tuyến dựa trên Spotify, tái hiện các tính năng cốt lõi như phát nhạc, đăng nhạc, tải nhạc, danh sách phát và xác thực người dùng.
## Tính năng
* Đăng nhập/đăng ký người dùng
* Tìm kiếm bài hát, albums, playlists
* Tạo và quản lý playlists
* Phát nhạc với điều khiển play/pause/shuffle/repeate
* Thiết kế đáp ứng cho desktop, tablet
## Công nghệ sử dụng
* Frontend: HTML, CSS, TailwindCSS, Ant Design, JavaScript (React.js)
* Backend: Python (Django)
* Database: MongoDB
## Cài đặt
1. Sao chép kho lưu trữ
git clone https://github.com/giacuong333/clone-spotify.git
2. Di chuyển vào thư mục client của dự án
cd clone-spotify/client
3. Cài đặt các gói phụ thuộc
yarn install
4. Di chuyển vào thư mục server của dự án
pip install -r requirements.txt
5. Khởi động client
yarn run dev
6. Khởi động server
python manage.py runserver
## Sử dụng
Truy cập ứng dụng tại http://localhost:5173.
Đăng ký hoặc đăng nhập để khám phá các tính năng.
Tìm kiếm bài hát, tạo danh sách phát và thưởng thức nhạc.
## Hình ảnh giao diện
### Client:
* Login
![Alt text](https://drive.usercontent.google.com/download?id=1Q6vk9Dlpy9I3ILiWaWC5dW5kMF8qB1b4&authuser=0)
* Register
![Alt text](https://drive.usercontent.google.com/download?id=1Sxp5Uraf4E8UPvTicgTOgEB64RmUJlRW&authuser=0)
* Search
![Alt text](https://drive.usercontent.google.com/download?id=1DHMai2bYeHRlafpTTIBOifPq7B5yUS8F&authuser=0)
* Song, Album details
* Upload Song Form Step 1
* Upload Song Form Step 2
* Upload Song Form Step 3
* Upload Song Form Step 4
* Upload Song Success
### Server:
* Song management
* User management
* Genre management
## Thành viên nhóm
* Lê Gia Cường
* Võ Đình Văn 
* Phạm Minh Trung
* Hoàng Sỹ Khiêm
* Koong Chấn Phong
## Đóng góp
1. Fork kho lưu trữ.
2. Tạo nhánh tính năng (git checkout -b feature/your-feature).
3. Commit thay đổi (git commit -m 'Add your feature').
4. Push lên nhánh (git push origin feature/your-feature).
5. Tạo Pull Request.
