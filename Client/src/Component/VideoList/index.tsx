import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.scss";
import VideoContent from "../VideoContent";
import { Video } from "../../types";
import ModalVideo from "../ModalVideo";
import { appManage, setIsLoggedIn } from "../../store/slices/app";
import { useSelector, useDispatch } from "react-redux";
import Modal, { ModalType } from "../Modal";

interface Prop {
  list: Video[];
  fetchList: () => void;
}

const VideoList: FC<Prop> = ({ list, fetchList }) => {
  const videoListRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { modalPosition } = useSelector(appManage);
  const [selectedVideo, setSelectedVideo] = useState<null | Video>(null);
  const dispatch = useDispatch();

  const defaultOption = useMemo(
    () => ({
      root: null,
      threshold: 0.5,
      rootMargin: "0px",
    }),
    []
  );

  const checkIntersect = useCallback(
    ([entry]: any, observer: any) => {
      if (entry.isIntersecting) {
        fetchList();
        // getLikedList();
      }
    },
    [fetchList]
  );

  useEffect(() => {
    dispatch(setIsLoggedIn(true));
    let observer: IntersectionObserver;
    // 관찰타겟이 존재하는지 체크
    if (loaderRef.current) {
      observer = new IntersectionObserver(checkIntersect, defaultOption); // 관찰타겟이 존재한다면 관찰자를 생성한다.
      observer.observe(loaderRef.current); // 관찰자에게 관찰타겟을 알려준다
    }
    return () => {
      observer && observer.disconnect(); // 페이지 새로고침 시 관찰자가 존재하면 관찰을 멈춘다.
      sessionStorage.removeItem("likedListPageToken"); // 기존의 리스트 토큰을 삭제한다.
    };
  }, [checkIntersect, defaultOption]);

  return (
    <div style={{ display: "flex", flexFlow: "column" }}>
      <section className={styles.video_list} ref={videoListRef}>
        {list &&
          list.map((video: Video) => {
            return (
              <VideoContent
                video={video}
                key={video.id}
                setSelectedVideo={setSelectedVideo}
              />
            );
          })}
      </section>
      <div ref={loaderRef} style={{ marginTop: "20px", textAlign: "center" }}>
        Loading...
      </div>
      {selectedVideo && modalPosition !== undefined && (
        <Modal
          type={ModalType.VIDEO}
          title={selectedVideo.title}
          id={selectedVideo.id}
        />
      )}
    </div>
  );
};

export default VideoList;
