import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

const initialState = {
  folderList: [],
};

// slice 생성
const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    setFolderList(state, {payload}) {
      state.folderList = payload;
    },
    
  }
});

export const { setFolderList } = folderSlice.actions;
export const folderManage = (state: RootState) => state.folder;

export default folderSlice.reducer;