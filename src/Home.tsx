import axios from "axios";
import { useState, useEffect } from "react";
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
    const {
      data: { items },
    } = await axios.get(URL);

    setVideoList(
      items.map((item: any) => {
        const id = item.id.videoId;
        const { title, channelTitle, description, publishedAt, thumbnails } =
          item.snippet;

        console.log(thumbnails);

        return {
          id,
          title,
          channelTitle,
          description,
          publishedAt,
          thumbnails,
        };
      })
    );
  };
  return (
    <div>
      Home
      {videoList &&
        videoList.slice(0, 20).map((video) => {
          const {
            id,
            title,
            channelTitle,
            description,
            publishedAt,
            thumbnails,
          } = video;
          return (
            <div>{<img src={thumbnails.medium.url} alt="thumbnail" />}</div>
            // <div key={title}>
            //   {/* <p>{title}</p> */}
            //   {/* <img src={thumbnails.medium.url} alt="" /> */}
            //   <iframe
            //     id={id}
            //     title={title}
            //     // type="text/html"
            //     width="720"
            //     height="405"
            //     src={`https://www.youtube.com/embed/${id}`}
            //     // frameborder="0"
            //     // allowfullscreen
            //   ></iframe>
            // </div>
          );
        })}
    </div>
  );
};

export default Home;
