import { Video } from "../../types";
import calcTimeDiff from "../../utils/calcTimeDiff";
import "./index.less";
import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setIsMaskOn } from "../../store/slices/app";
interface Props {
  video: Video;
  setSelectedVideo: (video: Video) => void;
}

const VideoContent: FC<Props> = ({ video, setSelectedVideo }) => {
  const { id, title, channelTitle, description, publishedAt, thumbnails } =
    video;
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    setSelectedVideo(video);
    dispatch(setIsMaskOn(true));
  }, [dispatch, setSelectedVideo, video]);

  return (
    <div key={id} className="video_content_box" onClick={handleClick}>
      <div className="video_img">
        <img src={thumbnails?.medium?.url} alt="thumbnail" />
      </div>
      <p className="title">{title}</p>
      <p className="subtitle">{channelTitle}</p>
      <p className="subtitle">{calcTimeDiff(publishedAt)}</p>
    </div>
  );
};

export default VideoContent;
