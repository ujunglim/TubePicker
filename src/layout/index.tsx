import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <div>
        <SideBar />
        <Main />
      </div>
    </div>
  );
};

export default AppLayout;
