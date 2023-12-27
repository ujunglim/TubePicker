import Header from "./Header";
import SideBar from "./SideBar";
import "./index.less";
import { FC, useState } from "react";

interface prop {
  children: any;
}

const AppLayout: FC<prop> = ({ children }) => {
  const [isMaskOn, setIsMaskOn] = useState<boolean>(true);
  const handleMask = () => {
    setIsMaskOn(false);
  };
  return (
    <div className="layout">
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
