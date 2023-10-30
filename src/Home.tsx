import axios from "axios";
import { useState, useEffect } from "react";
import Constant from "./utils/Constant";
import AppLayout from "./layout";
const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&channelId=UCw4izi2fsJzFltt3EbmokWA&type=video&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;

interface Video {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    medium: {
      url: string;
      height: number;
      width: number;
    };
  };
}

const Home = () => {
  const [videoList, setVideoList] = useState<Video[]>();

  useEffect(() => {
    getVideos();
  }, []);

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
    <div>
      {/* {videoList && videoList.map((video) => <AContent video={video} />)} */}
    </div>
  );
};

export default Home;
