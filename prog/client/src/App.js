import React from 'react';
import './styles/global.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from './redux/slices/AuthSlice';
import { Spinner } from '@fluentui/react';
import Layout from './pages/Layout';
import AdminLayout from './pages/AdminLayout';
import HomePage from './pages/Patient/HomePage';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import UserProfile from './pages/Patient/UserPage';
import AuthPage from './pages/AuthPage';
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminMedicines from './pages/admin/AdminMedicines';
import CompleteProfile from './components/CompleteProfile';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorLayout from './pages/DoctorLayout';
import ProtectedDoctorRoute from './components/Doctor/ProtectedDoctorRoute';
import DoctorsListPage from './pages/Patient/DoctorsList';
import DoctorDetailsPage from './pages/Patient/DoctorDetails';
import AppointmentFormPage from './pages/Patient/AppointmentFormPage';
import PatientAppointmentsPage from './pages/Patient/PatientAppointmentPage';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import MedicalCardPage from './pages/Doctor/MedicalCardPage';
import PatientMedicalResultPage from './pages/Patient/PatientMedicalResultPage';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, status: authStatus } = useSelector((state) => state.auth);
  const { currentPatient, status: patientStatus } = useSelector((state) => state.patient);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();

  React.useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      dispatch(fetchUserData(tokenFromStorage))
        .unwrap()
        .catch((err) => {
          if (err.message.includes('JWT expired') || 
              err.message.includes('Требуется повторный вход')) {
            localStorage.removeItem('token');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin' && !location.pathname.startsWith('/admin')) {
        window.location.replace('/admin');
        return;
      }

      if (user.role === 'doctor' && !location.pathname.startsWith('/doctor')) {
        window.location.replace('/doctor');
        return;
      }

      if (!location.pathname.startsWith('/complete-profile') && user.role !== 'admin' && user.role !== 'doctor' &&
          (!currentPatient || 
           !currentPatient.First_Name || 
           !currentPatient.Last_Name || 
           !currentPatient.Birthdate)) {
        navigate('/complete-profile');
      }
    }
  }, [loading, user, currentPatient, location.pathname]);

  if (loading) {
    return <Spinner size="large" label="Загрузка..." />;
  }

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route element={<Layout hideAuthButtons />}>
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/register" element={<RegistrationForm />} />
      </Route>
      
      {/* Маршруты пациентов*/}
      {/* {<Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>} */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors_list" element={<DoctorsListPage />} />
        <Route path="/doctors_list/:id" element={<DoctorDetailsPage />} />
        <Route path="/book-appointment" element={<ProtectedRoute><AppointmentFormPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><PatientAppointmentsPage /></ProtectedRoute>} />
        <Route path="/me" element={<UserProfile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/medical-results" element={<PatientMedicalResultPage />} />
      </Route>
      
      {/* Админские маршруты */}
      <Route element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/medicines" element={<AdminMedicines />} />
      </Route>

      {/* Машруты врачей */}
      <Route element={<ProtectedDoctorRoute ><DoctorLayout /></ProtectedDoctorRoute >}>
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/medical-card/:patientId" element={<MedicalCardPage />} />
      </Route>
      
      {/* Обработка несуществующих маршрутов */}
      <Route path="*" element={
        token ? (
          <Navigate to={
            user?.role === 'admin' ? '/admin' : 
            user?.role === 'doctor' ? '/doctor' : 
            '/'
          } replace />
        ) : (
          <Navigate to="/" replace />
        )
      } />
    </Routes>
  );
};

export default App;