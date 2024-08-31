import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AppUtils } from '@/booking/service';

export interface AppState {
    langChanged?: boolean;
    search?: string;
    pages?: any;
}

const initialState: AppState = {
    langChanged: false,
    search: '',
    pages: {}
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleLangChanged: (state) => {
            state.langChanged = !state.langChanged;
        },
        updateApp: (state, action: PayloadAction<AppState>) => {
            let newSt: AppState = action.payload || {};
            AppUtils.assign(state, newSt);
        }
    }
});

export const { toggleLangChanged, updateApp } = appSlice.actions;
export default appSlice.reducer;
