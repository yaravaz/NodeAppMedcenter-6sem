import React from 'react';
import { useNavigate } from 'react-router-dom';

const AppointmentFrom = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };

  return (
    <section id="appointment" className="appointment">
      <div className="container">
        <h2>Запись на прием</h2>
        <div className="appointment-info-main">
          <p className="appoint-form-text" >Для записи на прием к нашим специалистам нажмите кнопку ниже.</p>
          <p className="appoint-form-text" >Не откладывайте заботу о своем здоровье! Запишитесь на прием к нашим специалистам всего в несколько кликов. Мы готовы помочь вам в любом вопросе!
          </p>
          
          <div className="appointment-cta">
            <button 
              onClick={handleBookAppointment}
              className="btn btn-primary"
            >
              Записаться
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentFrom;