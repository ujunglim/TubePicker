import { Video } from "../../types";
import calcTimeDiff from "../../utils/calcTimeDiff";
import "./index.less";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
interface Props {
  video: Video;
  setSelectedVideoId: (id: string) => void;
}

const VideoContent: FC<Props> = ({ video, setSelectedVideoId }) => {
  const { id, title, channelTitle, description, publishedAt, thumbnails } =
    video;
  const navigate = useNavigate();

  const handleClick = useCallback(
    (videoId: string) => {
      // navigate(`/watch/${videoId}`);
      setSelectedVideoId(videoId);
    },
    [setSelectedVideoId]
  );

  return (
    <div key={id} className="video_content_box" onClick={() => handleClick(id)}>
      <div className="video_img">
        <img src={thumbnails?.medium?.url} alt="thumbnail" />
      </div>
      <p className="title">{title}</p>
      <p className="subtitle">{channelTitle}</p>
      <p className="subtitle">{calcTimeDiff(publishedAt)}</p>
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
