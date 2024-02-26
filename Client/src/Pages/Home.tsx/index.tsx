import { useState, useEffect } from "react";
import { Video } from "../../types";
import api from "../../api";
import VideoList from "../../Component/VideoList";
import { setIsLoggedIn } from "../../store/slices/app";
import { useDispatch } from "react-redux";

const Home = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedList, setLikedList] = useState<Video[] | []>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // 로그인
    dispatch(setIsLoggedIn(true));
  }, [dispatch]);

  const getPlaylist = async () => {
    const response = await api.get("/user/playList");
    setPlaylists(response.data);
  };

  const getLikedList = async () => {
    try {
      const {
        data: { likedList, nextPageToken },
      } = await api.get("/user/likeList", {
        prevPageToken: sessionStorage.getItem("likedListPageToken"),
      }); // todo prevPageToken
      setLikedList((prev) => [...prev, ...likedList]);
      sessionStorage.setItem("likedListPageToken", nextPageToken);
    } catch (err) {
      console.log(err);
    }
  };

  return <VideoList list={likedList} fetchList={getLikedList} />;
};

export default Home;
