import api from '.';

export const fetchFolderList = async () => {
  try {
    const { data } = await api.get("/folder");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};