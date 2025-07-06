import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AdminService from '../../services/AdminService';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchMedicines = createAsyncThunk(
  'medicines/fetchAll',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const response = await AdminService.getMedicines(token);
    return response;
  }
);

export const addMedicine = createAsyncThunk(
  'medicines/add',
  async (medicineData, { getState }) => {
    const token = getState().auth.token;
    const response = await AdminService.addMedicine(medicineData, token);
    return response;
  }
);

export const updateMedicineStatus = createAsyncThunk(
  'medicines/update',
  async ({ id, isAvailable }, { getState }) => {
    const token = getState().auth.token;
    const response = await AdminService.updateMedicineStatus(id, isAvailable, token);
    return response;
  }
);

export const deleteMedicine = createAsyncThunk(
  'medicines/delete',
  async (id, { getState }) => {
    const token = getState().auth.token;
    await AdminService.deleteMedicine(id, token);
    return id;
  }
);

export const updateMedicinePrice = createAsyncThunk(
  'medicines/updatePrice',
  async ({ id, Price }, { getState }) => {
    const token = getState().auth.token;
    const response = await AdminService.updateMedicinePrice(id, Price, token);
    return response;
  }
);

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMedicineStatus.fulfilled, (state, action) => {
        const { id, pharmSubgroup, ign, dosageForm, price, isAvailable } = action.payload;
        state.items = state.items.map(medicine => 
          medicine.id === id ? { ...medicine, isAvailable } : medicine
        );
        state.status = 'succeeded';
      })
      .addCase(updateMedicineStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        //state.items = state.items.filter(medicine => medicine.id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(updateMedicinePrice.fulfilled, (state, action) => {
        const { id, pharmSubgroup, ign, dosageForm, price, isAvailable } = action.payload;
        state.items = state.items.map(medicine => 
          medicine.id === id ? { ...medicine, price } : medicine
        );
      });
  },
});

export default medicineSlice.reducer;