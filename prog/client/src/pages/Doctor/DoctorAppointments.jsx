import React, { useEffect, useState } from 'react';
import { Card, Collapse, Tag, Avatar, Badge, Input, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserInjured, FaCalendarCheck, FaClock, FaNotesMedical, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchAppointments, fetchDoctorByUserId } from '../../redux/slices/DoctorSlice';
import dayjs from 'dayjs';
import moment from 'moment';
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import '../../styles/doctorAppointments.css';

const { Panel } = Collapse;

moment.locale('ru');

const DoctorAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments = [], status, doctor, patients = [] } = useSelector(state => state.doctor);
  const { user } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctorByUserId({ userId: user.id }));
    if(doctor){
        dispatch(fetchAppointments({ doctorId: doctor.id }));
    }
  }, [dispatch, doctor?.id, user.id]);

  const getPatientById = (patientId) => {
    return patients.find(p => p.id === patientId) || {
      id: patientId,
      lastName: 'Неизвестно',
      firstName: '',
      patronymic: '',
      birthdate: null,
      phone: ''
    };
  };

  const getAppointmentInterval = (appointmentDate) => {
    if (!doctor?.schedule?.length) return 30;
    const dayOfWeek = moment(appointmentDate).day();
    const scheduleForDay = doctor.schedule.find(s => s.day_of_week === dayOfWeek);
    return scheduleForDay?.interval || 30;
  };

  const formatAppointmentTime = (appointmentDate) => {
    const interval = getAppointmentInterval(appointmentDate);
    const startTime = moment(appointmentDate).format('HH:mm');
    const endTime = moment(appointmentDate).add(interval, 'minutes').format('HH:mm');
    return `${startTime}-${endTime}`;
  };

  const handleCardClick = (patientId) => {
    navigate(`/doctor/medical-card/${patientId}`);
  };

  const filteredAppointments = appointments.filter(app => {
    if (app.isDenied) return false;
    const patient = getPatientById(app.Patient_ID);
    const patientFullName = `${patient.lastName} ${patient.firstName} ${patient.patronymic}`.toLowerCase();
    const matchesSearch = searchTerm === '' || patientFullName.includes(searchTerm.toLowerCase());
    if (!dateFilter) return matchesSearch;
    const appointmentDate = dayjs(app.Appointment_Date).startOf('day');
    const selectedDate = dateFilter.startOf('day');
    return matchesSearch && appointmentDate.isSame(selectedDate);
  });

  const groupAppointmentsByDate = () => {
    const grouped = {};
    
    filteredAppointments
      .sort((a, b) => new Date(a.Appointment_Date) - new Date(b.Appointment_Date))
      .forEach(app => {
        const dateKey = moment(app.Appointment_Date).format('YYYY-MM-DD');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(app);
      });

    return grouped;
  };

  const groupedAppointments = groupAppointmentsByDate();
  const dates = Object.keys(groupedAppointments).sort();

  const calculateAge = (birthdate) => {
    if (!birthdate) return '';
    const age = moment().diff(moment(birthdate), 'years');
    return `${age} ${getRussianAgeLabel(age)}`;
  };

  const getRussianAgeLabel = (age) => {
    if (age % 100 >= 11 && age % 100 <= 14) return 'лет';
    switch (age % 10) {
      case 1: return 'год';
      case 2:
      case 3:
      case 4: return 'года';
      default: return 'лет';
    }
  };

  return (
    <div className="doctor-appointments">
      <Card 
        title={
          <div className="doctor-appointments-header">
            <FaCalendarCheck style={{ marginRight: 10, marginTop: 5 }} />
            <span>Расписание приемов</span>
            <Badge 
              count={filteredAppointments.length} 
              style={{ backgroundColor: '#52c41a', marginLeft: 10, marginTop: 8 }} 
            />
          </div>
        }
        bordered={false}
      >
        <div className="filters-container">
          <Input
            placeholder="Поиск по ФИО пациента"
            prefix={<FaSearch />}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          
          <DatePicker
            placeholder="Выберите дату"
            onChange={(date) => {
                console.log("Выбрана дата:", date);
                setDateFilter(date)
            }}
            style={{ marginLeft: 10 }}
            allowClear
            locale={locale}
            format="DD.MM.YYYY"
          />
        </div>

        {dates.length === 0 ? (
          <div className="no-appointments">
            <FaNotesMedical size={24} />
            <p>Записи не найдены</p>
          </div>
        ) : (
          <Collapse 
            bordered={false} 
            defaultActiveKey={dates.slice(0, 3)} 
            className="appointments-collapse"
          >
            {dates.map(date => (
              <Panel 
                key={date}
                header={
                  <div className="panel-header">
                    <Tag color="blue">
                      {moment(date).format('dddd, D MMMM YYYY')}
                    </Tag>
                    <Badge 
                      count={groupedAppointments[date].length} 
                      style={{ backgroundColor: '#52c41a', marginLeft: 10 }} 
                    />
                  </div>
                }
              >
                <div className="appointments-grid">
                  {groupedAppointments[date].map(app => {
                    const patient = getPatientById(app.Patient_ID);
                    return (
                      <div 
                        key={app.ID} 
                        className="appointment-card"
                        onClick={() => handleCardClick(patient.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="appointment-header">
                          <div className="patient-info">
                            <span className="patient-name">
                              {patient.lastName} {patient.firstName} {patient.patronymic}
                            </span>
                            {patient.birthdate && (
                              <span className="patient-age">
                                {calculateAge(patient.birthdate)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="appointment-details">
                          <Tag 
                            icon={<FaClock style={{ marginRight: 10, marginTop: 5 }} />} 
                            color="green"
                            style={{ width: 100 }}
                          >
                            {formatAppointmentTime(app.Appointment_Date)}
                          </Tag>
                          
                          {patient.phone && (
                            <div className="patient-phone">
                              <span>Тел.: {patient.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            ))}
          </Collapse>
        )}
      </Card>
    </div>
  );
};

export default DoctorAppointments;