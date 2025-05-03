import React, { useEffect, useState, useCallback } from "react";
import { Table, Spin, Alert, Typography } from "antd"; // Import thêm Spin, Alert, Typography
import { instance } from "../../contexts/Axios"; // Import axios instance
import { apis } from "../../constants/apis"; // Import định nghĩa API

const { Title } = Typography;

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Hàm gọi API lấy danh sách user
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError(null); // Reset lỗi trước khi gọi
		try {
			// Gọi API backend (đã tạo ở phần trước)
			// Cần đảm bảo đã đăng nhập với quyền Admin và token được gửi kèm request (Axios interceptor nên làm việc này)
			const response = await instance.get(apis.users.getAll()); // apis.users.getAll() trả về '/api/users/'
			if (response.status === 200) {
				// Thêm key cho mỗi dòng dữ liệu để Table của Antd không báo warning
				const usersWithKeys = response.data.map((user) => ({
					...user,
					key: user.id, // Dùng id làm key
				}));
				setUsers(usersWithKeys);
			} else {
				// Xử lý trường hợp API trả về status khác 200 (ít xảy ra với GET thành công)
				setError("Failed to fetch users: Unexpected status code " + response.status);
			}
		} catch (err) {
			console.error("Error fetching users:", err);
			// Hiển thị lỗi thân thiện hơn
			setError(err.response?.data?.detail || err.message || "An error occurred while fetching users.");
			setUsers([]); // Reset danh sách user khi có lỗi
		} finally {
			setLoading(false);
		}
	}, []); // Không có dependencies, chỉ chạy 1 lần

	// Gọi API khi component được mount lần đầu
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]); // Thêm fetchUsers vào dependencies của useEffect

	// Định nghĩa các cột cho bảng Ant Design
	// Dựa trên các trường trong UserDisplaySerializer bên backend
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			// Có thể ẩn cột ID nếu không cần thiết
			// render: (text) => <span title={text}>{text.substring(0, 8)}...</span> // Rút gọn nếu cần
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			sorter: (a, b) => a.name.localeCompare(b.name), // Thêm sắp xếp
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			sorter: (a, b) => a.email.localeCompare(b.email), // Thêm sắp xếp
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			filters: [ // Thêm bộ lọc
                { text: 'Admin', value: 'admin' },
                { text: 'User', value: 'user' },
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0,
		},
		{
			title: "Created At",
			dataIndex: "created_at",
			key: "created_at",
			render: (text) => text ? new Date(text).toLocaleString() : 'N/A', // Format lại ngày giờ
			sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
		},
		{
			title: "Updated At",
			dataIndex: "updated_at",
			key: "updated_at",
			render: (text) => text ? new Date(text).toLocaleString() : 'N/A', // Format lại ngày giờ
			sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
		},
		// Thêm cột Actions nếu cần (ví dụ: nút xem chi tiết, sửa, xóa)
		// {
		// 	title: 'Actions',
		// 	key: 'actions',
		// 	render: (_, record) => (
		// 		<span>
		// 			<Button type="link" onClick={() => handleViewDetails(record.id)}>View</Button>
		// 			{/* Add Edit/Delete buttons if needed */}
		// 		</span>
		// 	),
		// },
	];

	// Hàm xử lý xem chi tiết (nếu cần)
	// const handleViewDetails = (userId) => {
	// 	console.log("View details for user:", userId);
	// 	// Navigate to user detail page or show modal
	// };

	return (
		<div>
			<Title level={2}>User Management</Title>
			{error && <Alert message="Error" description={error} type="error" showIcon closable style={{ marginBottom: 16 }} /> }
			<Spin spinning={loading}>
				<Table
					dataSource={users}
					columns={columns}
					rowKey="id" // Đảm bảo rowKey được set đúng
					pagination={{ pageSize: 10 }} // Phân trang
					scroll={{ x: 'max-content' }} // Cho phép scroll ngang nếu bảng quá rộng
				/>
			</Spin>
		</div>
	);
};

export default UserManagement;