import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import api from "../../api";

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
  return (
    <div>
      {list.map((e) => (
        <div>{e.title}</div>
      ))}
    </div>
  );
};

export default DetailFolder;
