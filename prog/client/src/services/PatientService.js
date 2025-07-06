import axios from 'axios';

const API_PATIENT_URL = 'http://localhost:8080/patients';
const API_APPOINTMENT_URL = 'http://localhost:8080/appointments';

class PatientService {
  static async createEmptyPatient(userId, token) {
    try {
        
      const response = await axios.post(
        `${API_PATIENT_URL}/empty`,
        { User_ID: userId },
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updatePatient(id, patientData, token) {
    try {
      const response = await axios.put(
        `${API_PATIENT_URL}/${id}`,
        patientData,
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getPatientByUserId(userId, token) {
    try {
      const response = await axios.get(
        `${API_PATIENT_URL}/user/${userId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async createAppointment(date, token) {
    try {
      const response = await axios.post(
        API_APPOINTMENT_URL,
        { date },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async cancelAppointment(appointmentId, token) {
    try {
      const response = await axios.put(
        `${API_APPOINTMENT_URL}/${appointmentId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async getPatientAppointments(patientId, token) {
    try {
      const response = await axios.get(
        `${API_APPOINTMENT_URL}/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
}

export default PatientService;