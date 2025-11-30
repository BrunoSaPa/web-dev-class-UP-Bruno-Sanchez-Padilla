import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5002';

export const registerUser = createAsyncThunk('auth/register', async (userData: any, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data.user;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const loginUser = createAsyncThunk('auth/login', async (userData: any, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data.user;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/logout`, { method: 'POST' });
        if (!response.ok) throw new Error('Logout failed');
        return null;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/user`);
        const data = await response.json();
        return data.user;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null as any,
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Login
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => { state.user = null; })
            // Check Auth
            .addCase(checkAuth.fulfilled, (state, action) => { state.user = action.payload; });
    },
});

export default authSlice.reducer;
