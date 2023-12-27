import { useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import SideBar from "./SideBar";
import "./index.less";
import { FC } from "react";
import { appManage, setIsMaskOn } from "../store/slices/app";

interface prop {
  children: any;
}

const AppLayout: FC<prop> = ({ children }) => {
  const { isMaskOn } = useSelector(appManage);
  const dispatch = useDispatch();

  const handleMask = () => {
    dispatch(setIsMaskOn(false));
  };
  return (
    <div className="layout" style={{ overflow: isMaskOn ? "hidden" : "auto" }}>
      {isMaskOn && <div className="mask" onClick={handleMask}></div>}
      <Header />
      <div className={"content"}>
        <SideBar />
        <div className="main">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
