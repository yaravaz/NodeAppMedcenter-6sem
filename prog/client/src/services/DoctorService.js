import axios from 'axios';

const API_DOCTOR_URL = 'http://localhost:8080/doctors';
const API_MEDICAL_URL = 'http://localhost:8080/medical';

class DoctorService {

  // static async getDoctorAppointments(doctorId, token) {
  //   try {
  //     const response = await axios.get(
  //       `${API_DOCTOR_URL}/${doctorId}/appointments`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || error.message);
  //   }
  // }

  static async getDoctorByUserId(userId, token) {
    try {
      const response = await axios.get(
        `${API_DOCTOR_URL}/doctor/${userId}`,
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

  static async getDoctorAppointments(doctorId, token) {
    try {
      const response = await axios.get(
        `${API_DOCTOR_URL}/appointments/${doctorId}`,
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

  static async getPatients(token) {
    try {
      const response = await axios.get(
        `${API_DOCTOR_URL}/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async getPatientById(patientId, token) {
    try {
      const response = await axios.get(
        `${API_DOCTOR_URL}/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async updateAppointmentStatus(appointmentId, status, token) {
    try {
      const response = await axios.patch(
        `${API_DOCTOR_URL}/appointments/${appointmentId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async updatePatientMedicalInfo(patientId, updates, token) {
    try {
      const response = await axios.put(
        `${API_DOCTOR_URL}/patients/${patientId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async updateDoctorInfo(doctorId, updates, token) {
    try {
      const response = await axios.put(
        `${API_DOCTOR_URL}/${doctorId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  // Medical

  static async getDiseases(token) {
    try {
      const response = await axios.get(
        `${API_MEDICAL_URL}/diseases`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async getMedications(token) {
    try {
      const response = await axios.get(
        `${API_MEDICAL_URL}/medications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async createMedicalResult(data, token) {
    try {
      const response = await axios.post(
        `${API_MEDICAL_URL}/results`,
        {
          patientId: data.patientId,
          description: data.description,
          diseases: data.diseases,
          medications: data.medications
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async getPatientMedicalResults(patientId, token) {
    try {
      const response = await axios.get(
        `${API_MEDICAL_URL}/results/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async createDiagnosis(data, token) {
    try {
      const response = await axios.post(
        `${API_MEDICAL_URL}/diagnoses`,
        {
          patientId: data.patientId,
          diseaseIds: data.diseaseIds,
          notes: data.notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async prescribeMedication(data, token) {
    try {
      const response = await axios.post(
        `${API_MEDICAL_URL}/prescriptions`,
        {
          diagnosisId: data.diagnosisId,
          medicationId: data.medicationId,
          dosage: data.dosage,
          duration: data.duration
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async getPatientDiagnoses(patientId, token) {
    try {
      const response = await axios.get(
        `${API_MEDICAL_URL}/diagnoses/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  static async getPatientDiagnosisData(patientId, token) {
  try {
    console.log(patientId)
    const response = await axios.get(
      `${API_MEDICAL_URL}/patients/${patientId}/diagnosis-data`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}
  
}

export default DoctorService;