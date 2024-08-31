import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import appReducer from './features/app/appSlice';
import authReducer from './features/auth/authSlice';
import settingsReducer from './features/settings/settingsSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            counter: counterReducer,
            app: appReducer,
            auth: authReducer,
            settings: settingsReducer
        }
    });
};

//Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

//Infer the RootState
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = ReturnType<AppStore['dispatch']>;
