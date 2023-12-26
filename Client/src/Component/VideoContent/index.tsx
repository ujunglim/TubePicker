import { Video } from "../../types";
import "./index.less";
import React, { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
interface props {
  video: Video;
}

const VideoContent: FC<props> = ({ video }) => {
  const { id, title, channelTitle, description, publishedAt, thumbnails } =
    video;
  const navigate = useNavigate();

  const handleClick = useCallback(
    (videoId: string) => {
      navigate(`/watch/${videoId}`);
    },
    [navigate]
  );

  return (
    <div key={id} className="video_content_box" onClick={() => handleClick(id)}>
      <div className="video_img">
        <img src={thumbnails?.medium?.url} alt="thumbnail" />
      </div>
      <p className="title">{title}</p>
      <p className="subtitle">{channelTitle}</p>
      <p className="subtitle">{"날짜"}</p>
      {/* <iframe
        id={id}
        title={title}
        // type="text/html"
        width="720"
        height="405"
        src={`https://www.youtube.com/embed/${id}`}
        // frameborder="0"
        // allowfullscreen
      ></iframe> */}
    </div>
  );
};

export default VideoContent;
