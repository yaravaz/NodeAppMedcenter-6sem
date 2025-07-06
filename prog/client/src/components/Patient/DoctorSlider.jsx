import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDoctors } from '../../redux/slices/AdminSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../styles/doctorSlider.css';

const MAX_DOCTORS_TO_SHOW = 6;

const DoctorsSlider = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.admin);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  const displayedDoctors = items.slice(0, MAX_DOCTORS_TO_SHOW);

  if (status === 'loading' || items.length === 0) return <div>Загрузка врачей...</div>;
  if (status === 'failed') return <div>Ошибка: {error}</div>;

  return (
    <section className="doctors-slider">
      <div className="container">
        <h2>Наши врачи</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {displayedDoctors.map(doctor => (
            <SwiperSlide key={doctor.id}>
              <div className="doctor-card-slider">
                {doctor.photo && (
                  <div className="doctor-photo-slider">
                    <img 
                      src={doctor.photo} 
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      style={{ 
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = '/default-doctor.jpg';
                        e.target.style.objectFit = 'contain';
                      }}
                    />
                  </div>
                )}
                <div className="doctor-info-slider">
                  <h3>{`${doctor.firstName} ${doctor.lastName} ${doctor.patronymic || ''}`}</h3>
                  <p className="specialization-slider">{doctor.specialization}</p>
                  <p className="category-slider">Категория: {doctor.category}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default DoctorsSlider;