import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../../services/AuthServices";
import { useNavigate } from "react-router-dom";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch }) => {
    const response = await AuthService.register(userData);
    // await AuthService.createEmptyPatient(
    //   response.user.ID,
    //   response.accessToken
    // );
    return response;
  }
);

export const createEmptyPatient = createAsyncThunk(
  "auth/createEmptyPatient",
  async ({ userId, token }) => {
    const response = await AuthService.createEmptyPatient(userId, token);
    return response;
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { dispatch }) => {
    console.log(userData)
    const response = await AuthService.login(userData);
    return response;
  }
);

export const fetchUserData = createAsyncThunk(
  "auth/fetchUser",
  async (tokenUser, { dispatch }) => {
    const token = localStorage.getItem("token");
    const response = await AuthService.fetchUser(tokenUser || token);
    return response;
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { dispatch }) => {
    const response = await AuthService.refresh();
    return response;
  }
);

export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (_, { getState, dispatch }) => {
    try {
      const token = getState().auth.token;
      await AuthService.deleteUser(token);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      return { success: true };
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, username, token }, { dispatch }) => {
    const response = await AuthService.updateUsername(token, userId, username);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.error = "";
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("token", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        console.log(state.user);
        state.token = action.payload.accessToken;
        state.error = "";
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("token", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        if (
          action.error.message.includes("JWT expired") ||
          action.error.message.includes("Требуется повторный вход")
        ) {
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.user) {
          state.user = action.payload;
        }
        state.status = 'succeeded';
      })
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
