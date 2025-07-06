import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDoctors } from '../../redux/slices/AdminSlice';
import { fetchPatientAppointments, cancelAppointment } from '../../redux/slices/WRAppointmentSlice';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaClock, 
  FaMapMarkerAlt, 
  FaTimes,
  FaTrash,
  FaPlus,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';
import '../../styles/patientAppointmentsPage.css';

const PatientAppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPatient } = useSelector(state => state.patient);
  const { patientAppointments, status } = useSelector(state => state.appointment);
  const { items: doctors = [] } = useSelector(state => state.admin);
  
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(6); 

  useEffect(() => {
    if (currentPatient?.ID) {
      dispatch(fetchPatientAppointments(currentPatient.ID));
    }
    dispatch(fetchDoctors());
  }, [dispatch, currentPatient]);

  const handleCancel = async () => {
    if (selectedAppointment) {
      await dispatch(cancelAppointment(selectedAppointment.id));
      dispatch(fetchPatientAppointments(currentPatient.ID));
      setShowCancelModal(false);
      setCurrentPage(1); 
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const getAppointmentStatus = (dateString, isCancelled) => {
    if (isCancelled) return 'cancelled';
    return new Date(dateString) > new Date() ? 'upcoming' : 'completed';
  };

  const filteredAppointments = patientAppointments?.filter(app => {
    const status = getAppointmentStatus(app.appointmentData, app.isDenied);
    return activeTab === 'all' || status === activeTab;
  });

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments?.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments?.length / appointmentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getDoctorById = (doctorId) => {
    return doctors.find(doctor => doctor.id === doctorId) || {
      firstName: 'Неизвестно',
      lastName: '',
      specialization: 'Специалист',
      officeNumber: 'N/A'
    };
  };

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <PulseLoader color="var(--accent-color)" size={12} />
        <p>Загружаем ваши записи...</p>
      </div>
    );
  }

  return (
    <div className="patient-appointments-container">
      <header className="appointments-header">
        <h1>Мои записи</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/book-appointment')}
        >
          <FaPlus /> Новая запись
        </button>
      </header>

      <div className="appointments-tabs-container">
        <div className="appointments-tabs">
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('upcoming');
              setCurrentPage(1);
            }}
          >
            Предстоящие
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('completed');
              setCurrentPage(1);
            }}
          >
            Прошедшие
          </button>
          <button
            className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('cancelled');
              setCurrentPage(1);
            }}
          >
            Отмененные
          </button>
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
          >
            Все
          </button>
        </div>
      </div>

      <div className="appointments-content">
        {currentAppointments?.length > 0 ? (
          <>
            <div className="appointments-grid">
              {currentAppointments.map(appointment => {
                const status = getAppointmentStatus(appointment.appointmentData, appointment.isDenied);
                const doctor = getDoctorById(appointment.doctorId);
                
                return (
                  <div 
                    key={appointment.id} 
                    className={`appointment-card ${status}`}
                  >
                    <div className="card-header">
                      <div className="doctor-info">
                        <div className="doctor-avatar">
                          {doctor?.photo ? (
                            <img 
                              src={doctor.photo} 
                              alt={`${doctor.firstName} ${doctor.lastName}`}
                              className="doctor-photo"
                            />
                          ) : (
                            <div className="doctor-initials">
                              {doctor?.firstName?.charAt(0)}{doctor?.lastName?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3>Др. {doctor?.firstName} {doctor?.lastName}</h3>
                          <p className="specialization">{doctor?.specialization}</p>
                        </div>
                      </div>
                      
                      <div className="appointment-meta">
                        <span className="date-badge">
                          <FaCalendarAlt /> {formatDate(appointment.appointmentData)}
                        </span>
                        <span className={`status-badge ${status}`}>
                          {status === 'upcoming' ? 'Предстоит' : 
                          status === 'completed' ? 'Завершено' : 'Отменено'}
                        </span>
                      </div>
                    </div>

                    <div className="card-details">
                      {status === 'upcoming' && (
                        <div className="card-actions">
                          <button 
                            className="btn btn-cancel"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowCancelModal(true);
                            }}
                          >
                            <FaTimes /> Отменить
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-appointments">
            <FaCalendarAlt size={48} color="var(--secondary-color)" />
            <h3>Нет записей</h3>
            <p>У вас нет {activeTab === 'upcoming' ? 'предстоящих' : 
                          activeTab === 'completed' ? 'прошедших' : 'отмененных'} записей</p>
            {activeTab === 'upcoming' && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/book-appointment')}
              >
                <FaPlus /> Записаться к врачу
              </button>
            )}
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения отмены */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Отмена записи</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCancelModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <p>Вы действительно хотите отменить запись к врачу?</p>
              
              <div className="appointment-info">
                <p><strong>Врач:</strong> Др. {getDoctorById(selectedAppointment?.doctorId)?.firstName} {getDoctorById(selectedAppointment?.doctorId)?.lastName}</p>
                <p><strong>Дата:</strong> {selectedAppointment && formatDate(selectedAppointment.appointmentData)}</p>
                <p><strong>Специальность:</strong> {getDoctorById(selectedAppointment?.doctorId)?.specialization}</p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowCancelModal(false)}
              >
                Нет, оставить
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCancel}
              >
                Да, отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentsPage;