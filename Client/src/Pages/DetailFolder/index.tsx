import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import api from "../../api";
import VideoList from "../../Component/VideoList";

const DetailFolder = () => {
  const { id } = useParams();
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    getAllSubVideos();
  }, []);

  const getAllSubVideos = useCallback(async () => {
    const { data } = await api.get(`/folder/detail/${id}`);
    setList(data.list);
  }, [id]);

  return <VideoList list={list} fetchList={getAllSubVideos} />;
};

export default DetailFolder;
