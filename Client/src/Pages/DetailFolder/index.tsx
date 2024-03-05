import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import api from "../../api";
import VideoList from "../../Component/VideoList";

const DetailFolder = () => {
  const { id } = useParams();
  const [list, setList] = useState<any[]>([]);

  const getVideosOfAFolder = useCallback(async () => {
    try {
      const { data } = await api.get(`/folder/detail/${id}`);
      setList(data.list);
      sessionStorage.setItem("pageToken", data.pageToken);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [id]);

  useEffect(() => {
    getVideosOfAFolder();
  }, [getVideosOfAFolder]);

  return <VideoList list={list} fetchList={getVideosOfAFolder} />;
};

export default DetailFolder;
