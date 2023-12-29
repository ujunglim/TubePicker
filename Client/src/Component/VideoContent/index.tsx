import { Video } from "../../types";
import calcTimeDiff from "../../utils/calcTimeDiff";
import styles from "./index.module.scss";
import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setModalPosition } from "../../store/slices/app";
interface Props {
  video: Video;
  setSelectedVideo: (video: Video) => void;
}

const VideoContent: FC<Props> = ({ video, setSelectedVideo }) => {
  const { id, title, channelTitle, description, publishedAt, thumbnails } =
    video;
  const dispatch = useDispatch();

  const openModal = useCallback(() => {
    const scrollPos = window.scrollY;
    dispatch(setModalPosition(scrollPos));
    document.body.style.position = "fixed"; // 스크롤바를 없애준다
    document.body.style.top = `-${scrollPos}px`; // 기존위치를 고정한다
    document.body.style.paddingRight = "17px"; // 화면의 흔들림을 커버해준다
    setSelectedVideo(video);
  }, [dispatch, setSelectedVideo, video]);

  return (
    <div key={id} className={styles.video_content_box} onClick={openModal}>
      <div className={styles.video_img}>
        <img src={thumbnails?.medium?.url} alt="thumbnail" />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{channelTitle}</p>
      <p className={styles.subtitle}>{calcTimeDiff(publishedAt)}</p>
    </div>
  );
};

export default VideoContent;
