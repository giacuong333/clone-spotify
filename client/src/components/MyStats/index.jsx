import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Statistic, Spin, Alert, Typography } from 'antd';
import { CustomerServiceOutlined, DownloadOutlined } from '@ant-design/icons'; 
import { instance } from '../../contexts/Axios'; 
import { apis } from '../../constants/apis';   
import { useAuth } from '../../contexts/Auth'; 

const { Title } = Typography;

const MyStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth(); 

    const fetchMyStats = useCallback(async () => {
        if (!isAuthenticated || !user) {
            setError("User not logged in.");
            return;
        }

        setLoading(true);
        setError(null);
        try {

            const response = await instance.get(apis.users.getStats());
            if (response.status === 200) {
                setStats(response.data);
            } else {
                setError("Failed to fetch your statistics: Unexpected status code " + response.status);
                console.error("Stats fetch failed with status:", response.status, response.data);
            }
        } catch (err) {
            console.error("Error fetching user statistics:", err);
            setError(err.response?.data?.detail || err.response?.data?.error || err.message || "An error occurred while fetching your statistics.");
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]); 

    useEffect(() => {
        fetchMyStats(); 
    }, [fetchMyStats]); 

    if (!isAuthenticated) {
         return <Alert message="Please log in to view your statistics." type="info" />;
    }


    return (
        <div style={{ padding: '20px' }}>
            <Title level={3}>Your Statistics</Title>
            {error && <Alert message="Error" description={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}
            <Spin spinning={loading}>
                {stats ? (
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Card variant="borderless"> 
                                <Statistic
                                    title="Total Listens"
                                    value={stats.total_listens !== undefined ? stats.total_listens : '--'}
                                    prefix={<CustomerServiceOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                             <Card variant="borderless">
                                <Statistic
                                    title="Total Downloads"
                                    value={stats.total_downloads !== undefined ? stats.total_downloads : '--'}
                                    prefix={<DownloadOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    !loading && !error && <p>No statistics data available yet.</p>
                )}
            </Spin>
        </div>
    );
};

MyStats.displayName = 'MyStats';

export default MyStats;