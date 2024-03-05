import {configureStore} from '@reduxjs/toolkit';
import app from './slices/app';
import folder from './slices/folder';

const store = configureStore({
    reducer: {
      app, folder
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export interface AppThunkApiConfig {
    state: RootState;
    rejectValue: string;
}
