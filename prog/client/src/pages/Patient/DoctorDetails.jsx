import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDoctorById } from '../../redux/slices/AdminSlice';
import { FaUserMd, FaPhone, FaBirthdayCake, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { Tag, Divider, Card, Row, Col } from 'antd';
import '../../styles/doctorDetails.css';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentDoctor, currentDoctorSchedules, status, error } = useSelector(state => state.admin);
  
  useEffect(() => {
    dispatch(fetchDoctorById(id));
  }, [id, dispatch]);

  if (status === 'loading') {
    return <div className="loading">Загрузка информации о враче...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Ошибка: {error}</div>;
  }

  if (!currentDoctor) {
    return <div className="not-found">Врач не найден</div>;
  }

  const formatBirthdate = (dateString) => {
    if (!dateString) return 'Не указано';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  const daysOfWeek = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье'
  ];

  return (
    <div className="doctor-details-page">
      <div className="container">
        <div className="doctor-header">
          <div className="doctor-photo-deitals">
            {currentDoctor.photo ? (
              <img 
                src={currentDoctor.photo} 
                alt={`${currentDoctor.firstName} ${currentDoctor.lastName}`}
                onError={(e) => e.target.src = '/default-doctor.jpg'}
              />
            ) : (
              <div className="photo-placeholder">
                <FaUserMd size={64} />
              </div>
            )}
          </div>
          
          <div className="doctor-main-info">
            <h1>{`${currentDoctor.lastName} ${currentDoctor.firstName} ${currentDoctor.patronymic || ''}`}</h1>
            
            <div className="doctor-specialization">
              <Tag color="blue" style={{ fontSize: '1.1rem', padding: '8px' }}>
                {currentDoctor.specialization}
              </Tag>
              <p className="category">Категория: {currentDoctor.category}</p>
            </div>
            
            <div className="doctor-contacts">
              <p><FaPhone /> {currentDoctor.phone || 'Не указан'}</p>
              <p><FaBirthdayCake /> {formatBirthdate(currentDoctor.birthdate)}</p>
            </div>
          </div>
        </div>

        <Divider orientation="left">Расписание приёма</Divider>

        <div className="doctor-schedule">
          <Row gutter={[16, 16]}>
            {daysOfWeek.map(day => {
              const schedule = currentDoctorSchedules?.[day];
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={day}>
                  <Card 
                    title={day} 
                    size="small"
                    headStyle={{ backgroundColor: schedule ? '#f6ffed' : '#fff2f0' }}
                  >
                    {schedule ? (
                      <div className="schedule-item">
                        <p><FaClock /> {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</p>
                      </div>
                    ) : (
                      <div className="schedule-item not-working">
                        <FaCalendarAlt /> Выходной
                      </div>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>

        <div className="doctor-actions">
          <Link to="/doctors_list" className="btn btn-back">
            Назад к списку врачей
          </Link>
          <Link
            className="btn btn-primary"
            to="/book-appointment"
            state={{ doctorId: currentDoctor.id }}
          >
            Записаться на приём
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;