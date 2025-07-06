import React, { useEffect } from 'react';
import { Card, Spin, Descriptions, Tag, Divider, Table, Image } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserMd, FaCalendarAlt, FaPhone } from 'react-icons/fa';
import { fetchDoctorByUserId } from '../../redux/slices/DoctorSlice';
import '../../styles/doctorDashboard.css';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { doctor, status } = useSelector(state => state.doctor);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchDoctorByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  if (status === 'loading') return <Spin size="large" />;

  const scheduleColumns = [
  {
    title: 'День недели',
    dataIndex: 'day_of_week',
    key: 'day_of_week',
    render: day => {
      const daysMap = {
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
        7: 'Воскресенье'
      };
      return daysMap[day] || day;
    }
  },
  {
    title: 'Время приема',
    dataIndex: 'start_time',
    key: 'start_time',
    render: (text, record) => {
      const formatTime = (timeStr) => {
        if (!timeStr) return '';
        
        timeStr = timeStr.split('.')[0]; 
        timeStr = timeStr.split(':').slice(0, 2).join(':'); 
        
        return timeStr.replace(/^0(\d:)/, '$1');
      };
      
      return `${formatTime(text)} - ${formatTime(record.end_time)}`;
    }
  },
  {
    title: 'Интервал (мин)',
    dataIndex: 'interval',
    key: 'interval',
    render: interval => {
      if (!interval) return '';
      
      interval = interval.split('.')[0]; 
      interval = interval.split(':').slice(0, 2).join(':'); 
      
      return interval.replace(/^00:/, '').replace(/^0/, '');
    }
  }
  ];

  return (
    <div className="doctor-dashboard">
      <Card 
        title={
          <div className="doctor-name-header">
            <FaUserMd className="doctor-icon" />
            <span>Личный кабинет врача</span>
          </div>
        }
        bordered={false}
      >
        <div className="doctor-profile-container">
          <div className="doctor-photo-container">
            <Image
              width={300}
              src={doctor?.photo || 'https://via.placeholder.com/200'}
              alt="Фото врача"
              className="doctor-photo"
              fallback="https://via.placeholder.com/200"
            />
          </div>
          
          <div className="doctor-info-container">
            <Descriptions bordered column={1} className="doctor-info">
              <Descriptions.Item label="ФИО">
                <h3>{`${doctor?.lastName} ${doctor?.firstName} ${doctor?.patronymic}`}</h3>
              </Descriptions.Item>
              <Descriptions.Item label="Специализация">
                <Tag color="blue" style={{ fontSize: '14px' }}>{doctor?.specialization}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Категория">
                <Tag color="gold" style={{ fontSize: '14px' }}>{doctor?.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Контактный телефон">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaPhone style={{ marginRight: '8px' }} />
                  {doctor?.phone}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider orientation="left">
          <FaCalendarAlt /> График работы
        </Divider>
        
        <Table 
          dataSource={doctor?.schedule || []} 
          columns={scheduleColumns} 
          pagination={false}
          rowKey="day_of_week"
          className="schedule-table"
          bordered
        />
      </Card>
    </div>
  );
};

export default DoctorDashboard;