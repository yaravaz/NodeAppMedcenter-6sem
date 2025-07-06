import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PatientService from '../../services/PatientService';

export const createEmptyPatient = createAsyncThunk(
  'patient/createEmpty',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      return await PatientService.createEmptyPatient(userId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patient/update',
  async ({ id, patientData, token }, { rejectWithValue }) => {
    try {
      return await PatientService.updatePatient(id, patientData, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientByUserId = createAsyncThunk(
  'patient/fetchByUserId',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      return await PatientService.getPatientByUserId(userId, token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentPatient: null,
  status: 'idle',
  error: null
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearPatient: (state) => {
      state.currentPatient = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmptyPatient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEmptyPatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPatient = action.payload;
      })
      .addCase(createEmptyPatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    
      .addCase(updatePatient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPatient = action.payload;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(fetchPatientByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatientByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPatient = action.payload.data;
      })
      .addCase(fetchPatientByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearPatient } = patientSlice.actions;
export default patientSlice.reducer;