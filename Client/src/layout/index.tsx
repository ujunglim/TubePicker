import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import SideBar from "./SideBar";
import "./index.less";
import { FC } from "react";
import { appManage, setModalPosition } from "../store/slices/app";

interface prop {
  children: any;
}

const AppLayout: FC<prop> = ({ children }) => {
  const { modalPosition } = useSelector(appManage);
  const dispatch = useDispatch();

  const closeMask = () => {
    dispatch(setModalPosition(undefined));
    document.body.style.position = ""; // 스크롤바 적용
    window.scrollTo({ top: modalPosition }); // 스크롤바를 기존의 위치로
    document.body.style.paddingRight = "0px"; // 화면의 흔들림 커버
  };
  return (
    <div className="layout">
      {modalPosition && <div className="mask" onClick={closeMask}></div>}
      <Header />
      <div className={"content"}>
        <SideBar />
        <div className="main">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
