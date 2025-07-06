import axios from 'axios';

const API_URL = 'http://localhost:8080/admin';
const API_URL_N = 'http://localhost:8080/auth';

class AdminService {
  async getDoctors(token) {
    try {
      const response = await axios.get(`${API_URL_N}/doctors`
        // , {headers: { Authorization: `Bearer ${token}` },
        // withCredentials: true}
      );
      return response.data;
    } catch (error) {
        throw new Error(error);
    }
  }

  async getDoctorByUserId(userId, token) {
    try {
      const response = await axios.get(
        `${API_URL_N}/doctors/${userId}`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async addDoctor(formData, token) {
    try {
      const response = await axios.post(`${API_URL}/doctors`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
  
  async updateDoctor(id, formData, token) {
    try {
      console.log(formData);
      const response = await axios.put(`${API_URL}/doctors/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async deleteDoctor(id, token) {
    try {
      await axios.delete(`${API_URL}/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}`},
        withCredentials: true 
      });
    } catch (error) {
        throw new Error(error);
    }
  }

  async updateDoctorSchedule(doctorId, scheduleData, token) {
    try {
      const response = await axios.put(`${API_URL}/doctors/${doctorId}/schedule`, scheduleData, {
        headers: { Authorization: `Bearer ${token}`},
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
        throw new Error(error);
    }
  }

  async getMedicines(token) {
    try {
      const response = await axios.get(`${API_URL}/medicines`, {
        headers: { Authorization: `Bearer ${token}`},
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
        throw new Error(error);
    }
  }

  async addMedicine(medicineData, token) {
    try {
      console.log(medicineData)
      const response = await axios.post(`${API_URL}/medicines`, medicineData, {
        headers: { Authorization: `Bearer ${token}`},
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
        throw new Error(error);
    }
  }

  async updateMedicineStatus(id, isAvailable, token) {
    try {
      const response = await axios.put(`${API_URL}/medicines/${id}`, {isAvailable}, {
        headers: { Authorization: `Bearer ${token}`},
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateMedicinePrice(id, price, token) {
    try {
      console.log(price)
      const response = await axios.put(`${API_URL}/medicines/${id}/price`, { price }, {
        headers: { Authorization: `Bearer ${token}`},
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
        throw new Error(error);
    }
  }

  async deleteMedicine(id, token) {
    try {
      await axios.delete(`${API_URL}/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}`},
        withCredentials: true 
      });
    } catch (error) {
        throw new Error(error);
    }
  }

}

export default new AdminService();