import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DoctorService from '../../services/DoctorService';

export const fetchDoctorByUserId = createAsyncThunk(
  'doctor/fetchByUserId',
  async ({ userId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await DoctorService.getDoctorByUserId(userId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'doctor/fetchAppointments',
  async ({ doctorId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await DoctorService.getDoctorAppointments(doctorId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatients = createAsyncThunk(
  'doctor/fetchPatients',
  async ( _ , { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await DoctorService.getPatients(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//export const updateAppointmentStatus = createAsyncThunk(
//  'doctor/updateAppointmentStatus',
//  async ({ appointmentId, status, token }, { rejectWithValue }) => {
//    try {
//      return await DoctorService.updateAppointmentStatus(appointmentId, status, token);
//    } catch (error) {
//      return rejectWithValue(error.message);
//    }
//  }
//);

export const fetchPatientDetails = createAsyncThunk(
  'doctor/fetchPatientDetails',
  async ({ patientId, token }, { rejectWithValue }) => {
    try {
      return await DoctorService.getPatientDetails(patientId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePatientRecord = createAsyncThunk(
  'doctor/updatePatient',
  async ({ patientId, updates, token }, { rejectWithValue }) => {
    try {
      return await DoctorService.updatePatientMedicalInfo(patientId, updates, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'doctor/fetchPatientById',
  async ({patientId}, {getState}) => {
    const token = getState().auth.token;
    console.log(patientId)
    return await DoctorService.getPatientById(patientId, token);
  }
);

//export const updateMedicalRecord = createAsyncThunk(
//  'doctor/updateMedicalRecord',
//  async ({ patientId, diagnosis, treatment, notes }, {getState}) => {
//    const response = await DoctorService.put(`/patients/${patientId}/medical-record`, {
//      diagnosis,
//      treatment,
//      notes
//    });
//    return response.data;
//  }
//);

export const fetchDiseases = createAsyncThunk(
  'doctor/fetchDiseases',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await DoctorService.getDiseases(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMedications = createAsyncThunk(
  'doctor/fetchMedications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await DoctorService.getMedications(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMedicationResults = createAsyncThunk(
  'doctor/fetchMedicationResults',
  async ({patientId}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await DoctorService.getPatientMedicalResults(patientId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMedicalResult = createAsyncThunk(
  'doctor/createMedicalResult',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await DoctorService.createMedicalResult(data, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientDiagnosisData = createAsyncThunk(
  'doctor/fetchPatientDiagnosisData',
  async ({ patientId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await DoctorService.getPatientDiagnosisData(patientId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//export const updateDoctorProfile = createAsyncThunk(
//  'doctor/updateProfile',
//  async ({ doctorId, updates, token }, { rejectWithValue }) => {
//    try {
//      return await DoctorService.updateDoctorInfo(doctorId, updates, token);
//    } catch (error) {
//      return rejectWithValue(error.message);
//    }
//  }
//);

const initialState = {
  doctor: null,
  appointments: [],
  patients: [],
  diseases: [],
  results: [],
  medications: [],
  currentPatient: null,
  status: 'idle',
  error: null
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    //clearDoctor: (state) => {
    //  state.doctor = null;
    //  state.appointments = [];
    //  state.patients = [];
    //  state.currentPatient = null;
    //  state.status = 'idle';
    //  state.error = null;
    //},
    //setAppointments: (state, action) => {
    //  state.appointments = action.payload;
    //}
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctorByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.doctor = action.payload;
      })
      .addCase(fetchDoctorByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload.appointments || [];
        state.patients = action.payload.patients || [];
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      //.addCase(updateAppointmentStatus.fulfilled, (state, action) => {
      //  const index = state.appointments.findIndex(a => a.id === action.payload.id);
      //  if (index !== -1) {
      //    state.appointments[index] = action.payload;
      //  }
      //})
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        console.log(action.payload)
        state.currentPatient = action.payload;
      })
      .addCase(updatePatientRecord.fulfilled, (state, action) => {
        state.currentPatient = action.payload;
        const index = state.patients.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      }).addCase(fetchDiseases.fulfilled, (state, action) => {
        state.diseases = action.payload;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.medications = action.payload;
      })
      .addCase(fetchMedicationResults.fulfilled, (state, action) => {
        state.results = action.payload;
      })
      .addCase(fetchPatientDiagnosisData.fulfilled, (state, action) => {
        state.patientDiagnosisData = action.payload;
      })
      .addCase(createMedicalResult.fulfilled, (state, action) => {
        if (!state.currentPatient.medicalResults) {
          state.currentPatient.medicalResults = [];
        }
        state.currentPatient.medicalResults.unshift(action.payload);
      });
      //.addCase(updateDoctorProfile.fulfilled, (state, action) => {
      //  state.doctor = action.payload;
      //});
  }
});

export const { clearDoctor, setAppointments } = doctorSlice.actions;
export default doctorSlice.reducer;