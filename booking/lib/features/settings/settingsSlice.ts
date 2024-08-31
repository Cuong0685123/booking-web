import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AppUtils } from '@/booking/service';

export interface SettingsState {
    apiUrl: string;
    apiVersion: string;
    lang: string;
}

const initialState: SettingsState = {
    apiUrl: 'http://localhost:8000',
    apiVersion: 'v1',
    lang: 'en'
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        saveSettings: (state, action: PayloadAction<SettingsState>) => {
            AppUtils.assign(state, action.payload);
        }
    }
});

export const { saveSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
