import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import SideBar from "./SideBar";
import "./index.less";
import { FC, useEffect, useCallback } from "react";
import { appManage, setModalPosition } from "../store/slices/app";

interface prop {
  children: any;
}

const AppLayout: FC<prop> = ({ children }) => {
  const { modalPosition } = useSelector(appManage);
  const dispatch = useDispatch();

  const closeMask = useCallback(() => {
    dispatch(setModalPosition(undefined));
    document.body.style.position = ""; // 스크롤바 적용
    window.scrollTo({ top: modalPosition }); // 스크롤바를 기존의 위치로
    document.body.style.paddingRight = "0px"; // 화면의 흔들림 커버
  }, [dispatch, modalPosition]);

  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMask();
      }
    });

    return () => {
      window.removeEventListener("keydown", () => closeMask());
    };
  }, [closeMask]);

  return (
    <div className="layout">
      {modalPosition !== undefined && (
        <div className="mask" onClick={closeMask}></div>
      )}
      <Header />
      <div className={"content"}>
        <SideBar />
        <div className="main">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
