import React from 'react';
import { Link } from 'react-router-dom';
import AppointmentForm from '../../components/AppointmentForm';
import DoctorsSlider from '../../components/Patient/DoctorSlider';

const HomePage = () => {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Медицинский центр "Здоровье"</h1>
          <p>Профессиональная медицинская помощь с заботой о каждом пациенте</p>
          <Link to="/doctors_list" className="btn btn-primary">Наши врачи</Link>
        </div>
      </section>

      <section className="about">
        <div className="container">
          <h2>О нашем медицинском центре</h2>
          <p>Мы предоставляем широкий спектр медицинских услуг, направленных на поддержание вашего здоровья и благополучия. Наша команда высококвалифицированных специалистов готова предложить индивидуальный подход к каждому пациенту, обеспечивая качественную диагностику, лечение и профилактику заболеваний. Мы стремимся создать комфортную атмосферу, где каждый сможет получить необходимую медицинскую помощь и поддержку.</p>
        </div>
      </section>

      <DoctorsSlider />
      
      <AppointmentForm />
    </>
  );
};

export default HomePage;