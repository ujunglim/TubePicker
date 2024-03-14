import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.scss";
import VideoContent from "../VideoContent";
import { Video } from "../../types";
import { appManage } from "../../store/slices/app";
import { useSelector } from "react-redux";
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

  useEffect(() => {
    sessionStorage.removeItem("pageToken"); // 기존리스트 토큰페이지 삭제한다.
  }, []);

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
      }
    },
    [fetchList]
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    // 관찰타겟이 존재하는지 체크
    if (loaderRef.current) {
      observer = new IntersectionObserver(checkIntersect, defaultOption); // 관찰타겟이 존재한다면 관찰자를 생성한다.
      observer.observe(loaderRef.current); // 관찰자에게 관찰타겟을 알려준다
    }
    return () => {
      observer && observer.disconnect(); // 페이지 새로고침 시 관찰자가 존재하면 관찰을 멈춘다.
      sessionStorage.removeItem("pageToken"); // 기존리스트 토큰페이지 삭제한다.
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        width: "100%",
      }}
    >
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
      <div ref={loaderRef} className={styles.loader}></div>
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
