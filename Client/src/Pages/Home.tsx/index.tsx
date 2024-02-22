import { useState } from "react";
import { Video } from "../../types";
import api from "../../api";
import VideoList from "../../Component/VideoList";

const Home = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedList, setLikedList] = useState<Video[] | []>([]);

  const getPlaylist = async () => {
    const response = await api.post("/plalist");
    setPlaylists(response.data);
  };

  const getLikedList = async () => {
    const {
      data: { likedList, nextPageToken },
    } = await api.get("/likedlist", {
      prevPageToken: sessionStorage.getItem("likedListPageToken"),
    }); // todo prevPageToken

    setLikedList((prev) => [...prev, ...likedList]);
    sessionStorage.setItem("likedListPageToken", nextPageToken);
  };

  return <VideoList list={likedList} fetchList={getLikedList} />;
};

export default Home;
