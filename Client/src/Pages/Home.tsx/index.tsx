import { useState, useEffect, FC, useCallback } from "react";
import { Video } from "../../types";
import api from "../../api";
import VideoList from "../../Component/VideoList";
import { setIsLoggedIn } from "../../store/slices/app";
import { useDispatch } from "react-redux";
import { setFolderList } from "../../store/slices/folder";
import { fetchFolderList } from "../../api/folder";

const Home = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedList, setLikedList] = useState<Video[] | []>([]);
  const dispatch = useDispatch();

  const getFolderList = useCallback(async () => {
    const folderList = await fetchFolderList();
    dispatch(setFolderList(folderList));
  }, []);

  useEffect(() => {
    dispatch(setIsLoggedIn(true));
    getFolderList();
  }, [dispatch, getFolderList]);

  const getPlaylist = async () => {
    const response = await api.get("/user/playList");
    setPlaylists(response.data);
  };

  const getLikedList = async () => {
    try {
      const {
        data: { likedList, nextPageToken },
      } = await api.post("/user/likeList", {
        prevPageToken: sessionStorage.getItem("pageToken"),
      });

      setLikedList((prev) => [...prev, ...likedList]);
      sessionStorage.setItem("pageToken", nextPageToken);
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  };

  return <VideoList list={likedList} fetchList={getLikedList} />;
};

export default Home;
