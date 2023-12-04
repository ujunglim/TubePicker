import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";
import "./index.less";

const AppLayout = () => {
  return (
    <div className="layout">
      <Header />
      <div className={"content"}>
        <SideBar />
        <Main />
      </div>
    </div>
  );
};

export default AppLayout;
