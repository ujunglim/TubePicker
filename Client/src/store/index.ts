import {configureStore} from '@reduxjs/toolkit';
import app from './slices/app';

const store = configureStore({
    reducer: {
      app
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export interface AppThunkApiConfig {
    state: RootState;
    rejectValue: string;
}
