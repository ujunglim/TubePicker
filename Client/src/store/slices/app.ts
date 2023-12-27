import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

// 초기 상태 정의
const initialState = {
  isMaskOn: false
};

// slice 생성
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsMaskOn(state, {payload}) {
      state.isMaskOn = payload;
    }
  }
});

// 액션 생성자 함수들을 추출
export const { setIsMaskOn } = appSlice.actions;
export const appManage = (state: RootState) => state.app;

// 리듀서를 추출
export default appSlice.reducer;