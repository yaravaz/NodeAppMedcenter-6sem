import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DoctorService from '../../services/DoctorService';
import PatientService from '../../services/PatientService';

export const createAppointment = createAsyncThunk(
  'appointment/create',
  async ( date , { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await PatientService.createAppointment(date, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointment/cancel',
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await PatientService.cancelAppointment(appointmentId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientAppointments = createAsyncThunk(
  'appointment/fetchPatient',
  async (patientId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await PatientService.getPatientAppointments(patientId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDoctorAppointments = createAsyncThunk(
  'appointment/fetchDoctor',
  async (doctorId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log(doctorId);
      return await DoctorService.getDoctorAppointments(doctorId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  patientAppointments: [],
  doctorAppointments: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  cancelStatus: 'idle'
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.patientAppointments = [];
      state.doctorAppointments = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createAppointment.pending, (state) => {
      state.createStatus = 'loading';
    });
    builder.addCase(createAppointment.fulfilled, (state, action) => {
      state.createStatus = 'succeeded';
      state.patientAppointments.push(action.payload);
    });
    builder.addCase(createAppointment.rejected, (state, action) => {
      state.createStatus = 'failed';
      state.error = action.payload;
    });
    builder.addCase(cancelAppointment.pending, (state) => {
      state.cancelStatus = 'loading';
    });
    builder.addCase(cancelAppointment.fulfilled, (state, action) => {
      state.cancelStatus = 'succeeded';
      console.log(action.payload)
      //state.patientAppointments = action.payload;
      //state.patientAppointments.filter(
      //  app => app.id !== action.payload.id
      //);
    });
    builder.addCase(cancelAppointment.rejected, (state, action) => {
      state.cancelStatus = 'failed';
      state.error = action.payload;
    });
    builder.addCase(fetchPatientAppointments.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPatientAppointments.fulfilled, (state, action) => {
      state.status = 'succeeded'; 
      state.patientAppointments = action.payload;
    });
    builder.addCase(fetchPatientAppointments.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
    builder.addCase(fetchDoctorAppointments.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.doctorAppointments = action.payload.appointments;
    });
    builder.addCase(fetchDoctorAppointments.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
});

export const { clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;