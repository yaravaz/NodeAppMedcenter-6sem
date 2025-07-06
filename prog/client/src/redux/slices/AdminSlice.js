
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AdminService from '../../services/AdminService';

const initialState = {
  currentDoctor: null,
  items: [],
  currentDoctorSchedules: {}, 
  activePanels: [],
  status: 'idle',
  error: null
};

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await AdminService.getDoctors(token);
    return response;
  }
);

export const fetchDoctorById = createAsyncThunk(
  'admin/fetchDoctorById',
  async (id, { getState }) => {
    const token = getState().auth.token;
    const doctor = await AdminService.getDoctorByUserId(id, token);

    const scheduleData = (doctor.schedule || []).reduce((acc, s) => {
      if (s?.day_of_week) {
        acc[s.day_of_week] = {
          isWorking: true,
          startTime: s.start_time,
          endTime: s.end_time,
          interval: s.interval
        };
      }
      return acc;
    }, {});

    const formattedDoctor = {
      id: doctor.id,
      userId: doctor.userId,
      fullName: `${doctor.lastName} ${doctor.firstName} ${doctor.patronymic || ''}`.trim(),
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      patronymic: doctor.patronymic,
      birthdate: doctor.birthdate ? new Date(doctor.birthdate).toLocaleDateString('ru-RU') : null,
      age: doctor.birthdate ? calculateAge(doctor.birthdate) : null,
      phone: doctor.phone,
      photo: doctor.photo,
      specialization: doctor.specialization,
      category: doctor.category,
      schedule: doctor.schedule,
      shortSpecialization: doctor.specialization?.split(' ')[0] || doctor.specialization
    };

    return {
      doctor: formattedDoctor,
      scheduleData
    };
  }
);

function calculateAge(birthdate) {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export const addDoctor = createAsyncThunk(
  'doctors/add',
  async (formData, { getState }) => {
    const token = getState().auth.token;
    const response = await AdminService.addDoctor(formData, token);
    return response;
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/update',
  async (formData, { getState }) => {
    const token = getState().auth.token;
    const id = formData.get('id');
    const response = await AdminService.updateDoctor(id, formData, token);
    return response;
  }
);

export const deleteDoctor = createAsyncThunk(
  'doctors/delete',
  async (id, { getState }) => {
    const token = getState().auth.token;
    await AdminService.deleteDoctor(id, token);
    return id;
  }
);

export const updateDoctorSchedule = createAsyncThunk(
  'admin/updateDoctorSchedule',
  async (id, schedules, { getState }) => {
    const token = getState().auth.token;
    const response = await AdminService.updateDoctorSchedule(id, schedules, token);
    return response;
  }
);

const adminSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setActivePanels(state, action) {
      state.activePanels = action.payload;
    },
    setDoctorSchedule(state, action) {
      const { doctorId, scheduleData } = action.payload;
      state.currentDoctorSchedules[doctorId] = scheduleData;
    },
    resetScheduleState(state) {
      state.currentDoctorSchedules = {};
      state.activePanels = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.currentDoctorSchedules = action.payload.allSchedules;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        console.log(action.payload)
        state.currentDoctor = action.payload.doctor;
        state.currentDoctorSchedules = action.payload.scheduleData;
        state.status = 'succeeded';
      })
      .addCase(addDoctor.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.items.findIndex(d => d.ID === action.payload.ID);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.items = state.items.filter(d => d.ID !== action.payload);
      })
      .addCase(updateDoctorSchedule.fulfilled, (state, action) => {
        const index = state.items.findIndex(d => d.id === action.payload.doctorId);
        if (index !== -1) {
          state.items[index].schedule = action.payload.schedules;
        }
      });
  },
});

export default adminSlice.reducer;