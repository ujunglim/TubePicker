import axios from "axios";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Constant from "../../utils/Constant";
import VideoContent from "../../Component/VideoContent";
import "./index.less";
import { Video } from "../../types";
import ModalVideo from "../../Component/ModalVideo";
import { appManage } from "../../store/slices/app";
import { useSelector } from "react-redux";
const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&channelId=UCw4izi2fsJzFltt3EbmokWA&type=video&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;

const Home = () => {
  const [videoList, setVideoList] = useState<Video[]>();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedList, setLikedList] = useState<Video[] | []>([]);
  const [selectedVideo, setSelectedVideo] = useState<null | Video>(null);
  const { modalPosition } = useSelector(appManage);
  const videoListRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState<number>(1);

  const defaultOption = useMemo(
    () => ({
      root: null,
      threshold: 0.5,
      rootMargin: "0px",
    }),
    []
  );

  const checkIntersect = useCallback(([entry]: any, observer: any) => {
    if (entry.isIntersecting) {
      getLikedList();
    }
  }, []);

  useEffect(() => {
    // getVideos();
    let observer: IntersectionObserver;
    // 관찰타겟이 존재하는지 체크
    if (loaderRef.current) {
      observer = new IntersectionObserver(checkIntersect, defaultOption); // 관찰타겟이 존재한다면 관찰자를 생성한다.
      observer.observe(loaderRef.current); // 관찰자에게 관찰타겟을 알려준다
    }
    return () => observer && observer.disconnect(); // 페이지가 넘어갈떄 관찰자가 존재하면 관찰을 멈춘다.
  }, [checkIntersect, defaultOption]);

  const getPlaylist = async () => {
    const response = await axios.post("http://localhost:9090/api/plalist");
    setPlaylists(response.data);
  };

  const getLikedList = async () => {
    const response = await axios.get("http://localhost:9090/api/likedlist");
    setLikedList(response.data.likedlist);
  };

  // const getVideos = async () => {
  //   const localData = localStorage.getItem(Constant.DATA_NAME);
  //   if (localData) {
  //     setVideoList(JSON.parse(localData));
  //     return;
  //   }

  //   const {
  //     data: { items },
  //   } = await axios.get(URL);
  //   const videoList = items.map((item: any) => {
  //     const id = item.id.videoId;
  //     const { title, channelTitle, description, publishedAt, thumbnails } =
  //       item.snippet;

  //     return {
  //       id,
  //       title,
  //       channelTitle,
  //       description,
  //       publishedAt,
  //       thumbnails,
  //     };
  //   });
  //   setVideoList(videoList);
  //   localStorage.setItem(Constant.DATA_NAME, JSON.stringify(videoList));
  // };
  return (
    <div style={{ display: "flex", flexFlow: "column" }}>
      <div className="video_list" ref={videoListRef}>
        {/* <button onClick={getPlaylist}>get playlist</button> */}
        {/* <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>{playlist.title}</li>
          ))}
        </ul> */}
        {likedList &&
          likedList.map((video: Video) => {
            return (
              <VideoContent
                video={video}
                key={video.id}
                setSelectedVideo={setSelectedVideo}
              />
            );
          })}
        {/* {videoList && videoList.map((video) => <VideoContent video={video} />)} */}
      </div>
      <div ref={loaderRef} style={{ marginTop: "20px", textAlign: "center" }}>
        Loading...
      </div>
      {selectedVideo && modalPosition !== undefined && (
        <ModalVideo selectedVideo={selectedVideo} />
      )}
    </div>
  );
};

export default Home;
