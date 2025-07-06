import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import adminReducer from './slices/AdminSlice';
import medicineReducer from './slices/MedicineSlice';
import patientReducer from './slices/PatientSlice';
import doctorReducer from './slices/DoctorSlice';
import appointmentReducer from './slices/WRAppointmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer, 
    medicine: medicineReducer,
    patient: patientReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;