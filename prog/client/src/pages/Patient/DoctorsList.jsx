import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDoctors } from '../../redux/slices/AdminSlice';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserMd } from 'react-icons/fa';
import '../../styles/doctorsListPage.css';

const DoctorsListPage = () => {
  const dispatch = useDispatch();
  const { items: doctors, status } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  const specializations = ['all', ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      `${doctor.firstName} ${doctor.lastName} ${doctor.patronymic || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = 
      specializationFilter === 'all' || 
      doctor.specialization === specializationFilter;
    
    return matchesSearch && matchesSpecialization;
  });

  if (status === 'loading') {
    return <div className="loading">Загрузка списка врачей...</div>;
  }

  return (
    <div className="doctors-list-page">
      <div className="container">
        <h1><FaUserMd /> Наши врачи</h1>
        
        <div className="search-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по ФИО врача..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="specialization-filter"
          >
            {specializations.map(spec => (
              <option key={spec} value={spec}>
                {spec === 'all' ? 'Все специализации' : spec}
              </option>
            ))}
          </select>
        </div>
        
        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-card-list">
                <div className="doctor-photo-list">
                  {doctor.photo ? (
                    <img 
                      src={doctor.photo} 
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      onError={(e) => e.target.src = '/default-doctor.jpg'}
                    />
                  ) : (
                    <div className="photo-placeholder">
                      <FaUserMd size={48} />
                    </div>
                  )}
                </div>
                <div className="doctor-info-list">
                  <h3>{`${doctor.firstName} ${doctor.lastName} ${doctor.patronymic || ''}`}</h3>
                  <p className="specialization">{doctor.specialization}</p>
                  <p className="category">Категория: {doctor.category}</p>
                  <Link to={`/doctors_list/${doctor.id}`} className="btn btn-primary">
                    Подробнее
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Врачи по вашему запросу не найдены</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSpecializationFilter('all');
                }}
                className="btn btn-outline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsListPage;