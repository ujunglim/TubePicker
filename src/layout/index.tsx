import Header from "./Header";
import SideBar from "./SideBar";
import "./index.less";
import { FC } from "react";

interface prop {
  children: any;
}

const AppLayout: FC<prop> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className={"content"}>
        <SideBar />
        <div className="main">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
