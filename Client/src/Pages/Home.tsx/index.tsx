import { useState, useEffect, FC, useCallback } from "react";
import { Video } from "../../types";
import api from "../../api";
import VideoList from "../../Component/VideoList";
import { setIsLoggedIn } from "../../store/slices/app";
import { useDispatch } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { setFolderList } from "../../store/slices/folder";
import { fetchFolderList } from "../../api/folder";

const Home = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedList, setLikedList] = useState<Video[] | []>([]);
  const dispatch = useDispatch();

  const getFolderList = useCallback(async () => {
    const folderList = await fetchFolderList();
    dispatch(setFolderList(folderList));
    console.log(folderList);
  }, []);

  useEffect(() => {
    dispatch(setIsLoggedIn(true));
    getFolderList();
  }, [dispatch, getFolderList]);

  const getPlaylist = async () => {
    const response = await api.get("/user/playList");
    setPlaylists(response.data);
  };

  const getLikedList = async () => {
    try {
      const {
        data: { likedList, nextPageToken },
      } = await api.post("/user/likeList", {
        prevPageToken: sessionStorage.getItem("pageToken"),
      });

      setLikedList((prev) => [...prev, ...likedList]);
      sessionStorage.setItem("pageToken", nextPageToken);
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  };

  return (
    // <ErrorBoundary
    //   fallback={<div>Something went wrong</div>}
    //   FallbackComponent={ErrorFallback}
    //   onReset={() => {
    //   에러가 발생했을 때 재시도할 작업을 수행합니다.
    //   }}
    // >
    <VideoList list={likedList} fetchList={getLikedList} />
    // </ErrorBoundary>
  );
};

// const ErrorFallback: FC<any> = ({ error, resetErrorBoundary }) => {
//   return (
//     <div>
//       <h2>죄송합니다, 뭔가 잘못되었습니다.</h2>
//       <p>{error.message}</p>
//       <button onClick={resetErrorBoundary}>재시도</button>
//     </div>
//   );
};

export default Home;
