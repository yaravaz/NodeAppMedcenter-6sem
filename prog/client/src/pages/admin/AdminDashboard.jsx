import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, MedicineBoxOutlined, ScheduleOutlined,DollarOutlined } from '@ant-design/icons';
import '../../styles/adminDashboard.css';

const AdminDashboard = () => {
  const stats = [
    { title: 'Врачей', value: 24, icon: <UserOutlined />, color: '#3498db' },
    { title: 'Лекарств', value: 156, icon: <MedicineBoxOutlined />, color: '#2ecc71' },
    { title: 'Записей сегодня', value: 18, icon: <ScheduleOutlined />, color: '#e67e22' }
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Панель управления</h2>
      
      <Row gutter={[20, 20]} className="stats-row">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className="stat-card">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]} className="dashboard-row">
        <Col xs={24} md={12}>
          <Card title="Последние врачи" className="dashboard-card">
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Популярные лекарства" className="dashboard-card">
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;