import axios from "axios";
import { useState, useEffect } from "react";
import Constant from "../../utils/Constant";
import VideoContent from "../../Component/VideoContent";
import "./index.less";
import { Video } from "../../types";
const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&channelId=UCw4izi2fsJzFltt3EbmokWA&type=video&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;

const Home = () => {
  const [videoList, setVideoList] = useState<Video[]>();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedList, setLikedList] = useState<Video[]>();

  useEffect(() => {
    getVideos();
  }, []);

  const getPlaylist = async () => {
    const response = await axios.post("http://localhost:9090/api/plalist");
    setPlaylists(response.data);
  };

  const getLikedList = async () => {
    const response = await axios.get("http://localhost:9090/api/likedlist");
    setLikedList(response.data.likedlist);
  };

  const getVideos = async () => {
    const localData = localStorage.getItem(Constant.DATA_NAME);
    if (localData) {
      setVideoList(JSON.parse(localData));
      return;
    }

    const {
      data: { items },
    } = await axios.get(URL);
    const videoList = items.map((item: any) => {
      const id = item.id.videoId;
      const { title, channelTitle, description, publishedAt, thumbnails } =
        item.snippet;

      return {
        id,
        title,
        channelTitle,
        description,
        publishedAt,
        thumbnails,
      };
    });
    setVideoList(videoList);
    localStorage.setItem(Constant.DATA_NAME, JSON.stringify(videoList));
  };
  return (
    <div className="video_list">
      <button onClick={getPlaylist}>get playlist</button>
      <button onClick={getLikedList}> get LikedList</button>
      <h2>Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.title}</li>
        ))}
      </ul>
      {likedList &&
        likedList.map((video: Video) => {
          return <VideoContent video={video} key={video.id} />;
        })}
      {videoList && videoList.map((video) => <VideoContent video={video} />)}
    </div>
  );
};

export default Home;
