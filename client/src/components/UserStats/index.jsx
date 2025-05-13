import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Statistic, Spin, Alert, Typography } from "antd";
import { CustomerServiceOutlined, DownloadOutlined } from "@ant-design/icons";
import { instance } from "../../contexts/Axios";
import { apis } from "../../constants/apis";

const { Title } = Typography;

const UserStats = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const res = await instance.get(apis.users.getStatsById(id));
				setData(res.data);
			} catch (err) {
				setError(
					err.response?.data?.detail ||
						err.message ||
						"Error fetching user statistics."
				);
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, [id]);

	return (
		<div style={{ padding: "20px" }}>
			<Title level={3}>Statistics – User {data?.name || id}</Title>

			{error && (
				<Alert
					message="Error"
					description={error}
					type="error"
					showIcon
					closable
					style={{ marginBottom: 16 }}
				/>
			)}

			<Spin spinning={loading}>
				{data && (
					<Card style={{ maxWidth: 400 }}>
						<Statistic
							title="Total Listens"
							value={data.listens}
							prefix={<CustomerServiceOutlined />}
						/>
						<Statistic
							title="Total Downloads"
							value={data.downloads}
							prefix={<DownloadOutlined />}
							style={{ marginTop: 16 }}
						/>
					</Card>
				)}
			</Spin>
		</div>
	);
};

export default UserStats;
