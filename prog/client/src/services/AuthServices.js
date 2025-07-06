import axios from "axios";

const API_URL = 'http://localhost:8080/auth';
const API_PATIENT_URL = 'http://localhost:8080/patients';

const register = async(userData) => {
  try {
      const response = await axios.post(`${API_URL}/registration`, userData, {withCredentials: true});
      if (response.data && response.data.accessToken) {
          await createEmptyPatient(response.data.user.id, response.data.accessToken);
      }
      
      return response.data;
  } catch(error) {
      if(error.response) {
          console.log(error);
          throw new Error(error.response.data.message || 'Ошибка регистрации пользователя');
      } else if(error.request) {
          throw new Error('Нет ответа от сервера');
      } else {
          throw new Error('Ошибка ' + error.message);
      }
  }
}

const createEmptyPatient = async (userId, token) => {
  try {
      const response = await axios.post(
          `${API_PATIENT_URL}/empty`, 
          { User_ID: userId },
          {
              headers: {
                  Authorization: `Bearer ${token}`
              },
              withCredentials: true
          }
      );
      return response.data;
  } catch (error) {
      console.error('Ошибка при создании пустого пациента:', error);
      throw error;
  }
};


const login = async(userData) => {
    try{
        const response = await axios.post(`${API_URL}/login`, userData, {withCredentials:true});
        return response.data;
    } catch(error){
        if(error.response){
            throw new Error('Ошибка входа');
        } 
        else if(error.request){
            throw new Error('Нет ответа от сервера');
        }
        else{
            throw new Error('Ошибка ' + error.message);
        }
    }
}

const logout = async(userData) => {
    try{
        const response = await axios.post(`${API_URL}/logout`, userData, {withCredentials:true});
        return response.data;
    } catch(error){
        if(error.response){
            throw new Error('Ошибка входа');
        } 
        else if(error.request){
            throw new Error('Нет ответа от сервера');
        }
        else{
            throw new Error('Ошибка ' + error.message);
        }
    }
}

const refresh = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh токен отсутствует');
  }
  
  try {
    const response = await axios.get(`${API_URL}/refresh`, { 
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('refreshToken');
    throw error;
  }
};

const fetchUser = async (tokenUser) => {
  const token = localStorage.getItem('token') || tokenUser;

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const newTokens = await refresh();
        
        localStorage.setItem('token', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);
        
        const retryResponse = await axios.get(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${newTokens.accessToken}` },
          withCredentials: true,
        });
        return retryResponse.data;
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        throw new Error('Требуется повторный вход');
      }
    }
    throw error;
  }
};

const deleteUser = async (tokenUser) => {
  const token = localStorage.getItem('token') || tokenUser;

  try {
    const response = await axios.delete(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Ошибка удаления пользователя');
    } else if (error.request) {
      throw new Error('Нет ответа от сервера');
    } else {
      throw new Error('Ошибка: ' + error.message);
    }
  }
};

const updateUsername = async (token, userId, username) => {
    try {
        const response = await axios.patch(
            `${API_URL}/me/username`,
            { userId, username },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Ошибка обновления имени пользователя');
        } else if (error.request) {
            throw new Error('Нет ответа от сервера');
        } else {
            throw new Error('Ошибка: ' + error.message);
        }
    }
};

const AuthService = {
    API_URL,
    register,
    login,
    logout,
    refresh,
    fetchUser,
    deleteUser,
    updateUsername,
    createEmptyPatient,
};

export default AuthService;