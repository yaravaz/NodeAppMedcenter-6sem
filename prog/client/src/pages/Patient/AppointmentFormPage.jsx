import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchDoctors } from '../../redux/slices/AdminSlice';
import { fetchPatientByUserId } from '../../redux/slices/PatientSlice';
import { createAppointment, fetchDoctorAppointments } from '../../redux/slices/WRAppointmentSlice';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { message } from 'antd';
import '../../styles/appointmentFormPage.css';

const AppointmentFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { items: doctors } = useSelector(state => state.admin);
  const { currentPatient, status: patientStatus } = useSelector(state => state.patient);
  const { user } = useSelector(state => state.auth);
  const { token } = useSelector(state => state.auth);
  const { 
    createStatus, 
    error, 
    doctorAppointments, 
    status: appointmentsStatus 
  } = useSelector(state => state.appointment);
  
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  const doctorIdFromRoute = new URLSearchParams(location.search).get('doctorId');
  const doctorIdFromState = location.state?.doctorId;
  const initialDoctorId = doctorIdFromState || doctorIdFromRoute;

  console.log(doctorIdFromRoute)

  console.log('Location state:', location.state);
console.log('Query params:', new URLSearchParams(location.search).toString());
console.log('Initial doctor ID:', initialDoctorId);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchPatientByUserId({ userId: user.id, token: token }));
    }
    dispatch(fetchDoctors());
  }, [dispatch, user]);

  console.log(doctors)

  useEffect(() => {
    if (doctors.length > 0) {
      const uniqueSpecialties = [...new Set(doctors.map(d => d.specialization))];
      setSpecialties(uniqueSpecialties);

      if (initialDoctorId) {
        const doctor = doctors.find(d => d.id === initialDoctorId);
        if (doctor) {
          setSelectedDoctor(doctor);
          setSelectedSpecialty(doctor.specialization);
        }
      }
    }
  }, [doctors, initialDoctorId]);

  console.log(selectedDoctor)
  console.log(selectedSpecialty)

  useEffect(() => {
    if (selectedSpecialty) {
      const filtered = doctors.filter(d => d.specialization === selectedSpecialty);
      setFilteredDoctors(filtered);
      
      if (selectedDoctor && selectedDoctor.specialization !== selectedSpecialty) {
        setSelectedDoctor(null);
      }
    }
  }, [selectedSpecialty, doctors, selectedDoctor]);

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(fetchDoctorAppointments(selectedDoctor.id));
    }
  }, [selectedDoctor, dispatch]);
  
  useEffect(() => {
    if (selectedDoctor && doctorAppointments) {
      generateTimeSlots();
    }
  }, [selectedDoctor, doctorAppointments, currentWeek]);

  const parseIntervalToMinutes = (intervalStr) => {
    if (!intervalStr) return 60;
    const [hours, minutes] = intervalStr.split(':').map(Number);
    return (hours * 60) + minutes;
  };

  const generateTimeSlots = () => {
  if (!selectedDoctor?.schedule) return;

  const dayNameToIndex = {
    'Понедельник': 1,
    'Вторник': 2,
    'Среда': 3,
    'Четверг': 4,
    'Пятница': 5,
    'Суббота': 6,
    'Воскресенье': 7
  };

  const slots = [];
  const weekDates = getWeekDates();
  const now = new Date(); 
  
  selectedDoctor.schedule.forEach(schedule => {
    const dayIndex = dayNameToIndex[schedule.day_of_week];
    const dayDate = weekDates.find(d => d.dayIndex === dayIndex)?.fullDate;

    if (!dayDate) return;

    const startTime = new Date(dayDate);
    const [startHours, startMinutes] = schedule.start_time.split(':').map(Number);
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date(dayDate);
    const [endHours, endMinutes] = schedule.end_time.split(':').map(Number);
    endTime.setHours(endHours, endMinutes, 0, 0);

    const interval = parseIntervalToMinutes(schedule.interval); 
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime() + interval * 60000);
      if (nextTime > endTime) break;

      const isoTime = currentTime.toISOString();
      const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      const isBooked = doctorAppointments?.some(app => {
        const appDate = new Date(app.appointmentData);
        return appDate.getTime() === currentTime.getTime() && !app.isDenied;
      });

      const isPastTime = currentTime < now;

      slots.push({
        dayIndex,
        time: timeString,
        isoTime,
        isBooked,
        isAvailable: !isBooked && !isPastTime,
        isPastTime
      });
      currentTime = nextTime;
    }
  });

  setTimeSlots(slots);
  };

  const getWeekDates = () => {
    const startDate = new Date(currentWeek);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        day: days[i],
        date: date.getDate(),
        fullDate: date,
        dayIndex: i + 1,
        month: date.toLocaleString('default', { month: 'long' })
      };
    });
  };

  const handlePrevWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const handleTimeSelect = (isoTime) => {
    setSelectedTime(isoTime);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    
    if (!currentPatient || !selectedDoctor || !selectedTime || createStatus === 'loading') return;

    setAppointmentData({
      patientId: currentPatient.ID,
      doctorId: selectedDoctor.id,
      appointmentData: selectedTime
    });

    setShowModal(true);
  };

  const confirmAppointment = async () => {
    setShowModal(false);
    
    try {
      await dispatch(createAppointment(appointmentData)).unwrap();
      await dispatch(fetchDoctorAppointments(appointmentData.doctorId));
      await new Promise(resolve => setTimeout(resolve, 500));
      setSelectedTime(null);
      
      //generateTimeSlots();
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      message.error(error);
    }
  };

  const cancelAppointment = () => {
    setShowModal(false);
    setAppointmentData(null);
  };

  const isWorkingDay = (dayIndex) => {
    return selectedDoctor?.schedule?.some(s => {
      const dayNameToIndex = {
        'Понедельник': 1,
        'Вторник': 2,
        'Среда': 3,
        'Четверг': 4,
        'Пятница': 5,
        'Суббота': 6,
        'Воскресенье': 7
      };
      return dayNameToIndex[s.day_of_week] === dayIndex;
    });
  };

  if (patientStatus === 'loading' || appointmentsStatus === 'loading') {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (!currentPatient) {
    return null;
  }

  const weekDates = getWeekDates();

  return (
    <div className="appointment-form-page">
      <div className="container">
        <div className="specialty-header">
          <h1>Запись на прием</h1>
          <h2>Выберите врача и удобное время</h2>
        </div>

        <div className="specialty-selection">
          <label>Специальность:</label>
          <select
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            value={selectedSpecialty}
          >
            <option value="">Выберите специальность</option>
            {specialties.map((spec, i) => (
              <option key={i} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className={`doctor-selection ${!selectedSpecialty ? 'disabled-section' : ''}`}>
          <label>Врач:</label>
          <select
            onChange={(e) => setSelectedDoctor(filteredDoctors.find(d => d.id === e.target.value))}
            value={selectedDoctor?.id || ''}
            disabled={!selectedSpecialty}
          >
            <option value="">Выберите врача</option>
            {filteredDoctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className={`doctor-info ${!selectedDoctor ? 'disabled-section' : ''}`}>
          {selectedDoctor && (
            <>
              <h3>{selectedDoctor.firstName} {selectedDoctor.lastName}</h3>
              <p>Специальность: {selectedDoctor.specialization}</p>
            </>
          )}
        </div>

        <div className={`week-navigation ${!selectedDoctor ? 'disabled-section' : ''}`}>
          <button 
            onClick={handlePrevWeek} 
            disabled={!selectedDoctor}
          >
            <FaChevronLeft />
          </button>
          <span>
            {selectedDoctor 
              ? `${weekDates[0].date} ${weekDates[0].month} - ${weekDates[6].date} ${weekDates[6].month}`
              : 'Выберите врача для просмотра расписания'}
          </span>
          <button 
            onClick={handleNextWeek} 
            disabled={!selectedDoctor}
          >
            <FaChevronRight />
          </button>
        </div>

        <div className={`schedule-container ${!selectedDoctor ? 'disabled-section' : ''}`}>
          {selectedDoctor && (
            <>
              <div className="schedule-header">
                <div className="header-cell time-header">Время</div>
                {weekDates.map((day, i) => (
                  <div key={i} className={`header-cell ${!isWorkingDay(day.dayIndex) ? 'day-off' : ''}`}>
                    {day.day} {day.date}
                  </div>
                ))}
              </div>

              <div className="schedule-body">
                {Array.from(new Set(timeSlots.map(slot => slot.time)))
                  .sort((a, b) => a.localeCompare(b))
                  .map((time, i) => (
                    <div key={i} className="schedule-row">
                      <div className="time-cell">{time}</div>
                      {weekDates.map((day, j) => {
                        if (!isWorkingDay(day.dayIndex)) {
                          return <div key={j} className="time-slot disabled"></div>;
                        }

                        const slot = timeSlots.find(s => 
                          s.dayIndex === day.dayIndex && s.time === time
                        );

                        if (!slot || slot.isBooked || slot.isPastTime) {
                          return <div key={j} className="time-slot booked"></div>;
                        }

                        return (
                          <button
                            key={j}
                            className={`time-slot available ${selectedTime === slot.isoTime ? 'selected' : ''}`}
                            onClick={() => handleTimeSelect(slot.isoTime)}
                            disabled={!selectedDoctor}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>

        <div className={`form-actions ${!selectedTime ? 'disabled-section' : ''}`}>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSubmitClick}
            disabled={!selectedTime || createStatus === 'loading'}
          >
            {createStatus === 'loading' ? 'Запись...' : 'Записаться'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Назад
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Подтверждение записи</h3>
            <p>Вы уверены, что хотите записаться на выбранное время?</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={cancelAppointment}
              >
                Отмена
              </button>
              <button 
                className="btn btn-primary" 
                onClick={confirmAppointment}
                disabled={createStatus === 'loading'}
              >
                {createStatus === 'loading' ? 'Подтверждение...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentFormPage;