import {combineReducers, configureStore } from '@reduxjs/toolkit';
import app from './slices/app';
import folder from './slices/folder';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root', 
  storage, // 로컬 스토리지에 저장
};

const rootReducer = combineReducers({
  app,
  folder,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export default store;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export interface AppThunkApiConfig {
    state: RootState;
    rejectValue: string;
}
