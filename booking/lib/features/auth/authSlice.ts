import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AppUtils } from '@/booking/service';

export interface AuthState {
    isAuth: boolean;
    token: string;
    username: string;
    error: any;
    lang: string;
    tzOffset: number;
    roles: any[];
    perms: any[];
}

const initialState: AuthState = {
    isAuth: false,
    token: '',
    username: '',
    error: null,
    lang: 'en',
    tzOffset: 0,
    roles: [],
    perms: []
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        auth: (state, action: PayloadAction<any>) => {
            let newSt = action.payload;
            AppUtils.assign(state, newSt);
            state.isAuth = true;
        },
        invalidate: (state) => {
            state.isAuth = false;
        },
        logout: (state) => {
            AppUtils.assign(state, initialState);
        },
        updateAuth: (state, action: PayloadAction<any>) => {
            let newSt = action.payload;
            let { token } = newSt;
            if (token) {
                AppUtils.assign(state, { token });
            }
        }
    }
});

export const { auth, invalidate, logout, updateAuth } = authSlice.actions;
export default authSlice.reducer;
