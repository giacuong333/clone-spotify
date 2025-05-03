// client/src/components/AdminStatistics.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Statistic, Spin, Alert, Typography } from 'antd';
import { UserOutlined, PlaySquareOutlined, DownloadOutlined, CustomerServiceOutlined } from '@ant-design/icons'; // Import icons
import { instance } from '../../contexts/Axios';
import { apis } from '../../constants/apis';

const { Title } = Typography;

const AdminStatistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(apis.users.getAdminStats()); // /api/users/admin/stats/
            if (response.status === 200) {
                setStats(response.data);
            } else {
                setError("Failed to fetch statistics: Unexpected status code " + response.status);
            }
        } catch (err) {
            console.error("Error fetching admin statistics:", err);
            setError(err.response?.data?.detail || err.message || "An error occurred while fetching statistics.");
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div>
            <Title level={2}>Admin Dashboard - Statistics</Title>
            {error && <Alert message="Error" description={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}
            <Spin spinning={loading}>
                {stats ? (
                   <Row gutter={16}>
                   <Col xs={24} sm={12} md={12} lg={6}>
                       <Card variant="borderless">
                           <Statistic
                               title="Total Users"
                               value={stats.total_users}
                               prefix={<UserOutlined />}
                           />
                       </Card>
                   </Col>
                   <Col xs={24} sm={12} md={12} lg={6}>
                        <Card variant="borderless">
                           <Statistic
                               title="Total Songs"
                               value={stats.total_songs}
                               prefix={<PlaySquareOutlined />}
                           />
                       </Card>
                   </Col>
                   <Col xs={24} sm={12} md={12} lg={6}>
                       <Card variant="borderless">
                           <Statistic
                               title="Total Listens"
                               value={stats.total_listens}
                               prefix={<CustomerServiceOutlined />}
                           />
                       </Card>
                   </Col>
                   <Col xs={24} sm={12} md={12} lg={6}>
                        <Card variant="borderless">
                           <Statistic
                               title="Total Downloads"
                               value={stats.total_downloads}
                               prefix={<DownloadOutlined />}
                           />
                       </Card>
                   </Col>
                   {/* Card  */}
               </Row>
                ) : (
                    !loading && !error && <p>No statistics data available.</p> // lỗi/loading
                )}
            </Spin>
        </div>
    );
};

export default AdminStatistics;