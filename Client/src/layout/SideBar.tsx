import { useNavigate } from "react-router";
import styles from "./index.module.scss";
import SideTab from "../Component/SideTab";
import { useSelector } from "react-redux";
import { appManage } from "../store/slices/app";

const SideBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(appManage);

  const handleFolder = () => {
    navigate("/folders");
  };
  return (
    <aside>
      {isLoggedIn && (
        <>
          <SideTab
            title={"폴더 만들기"}
            handleClick={handleFolder}
            isFolder={false}
          />
          <SideTab title={"좋아요 영상"} handleClick={handleFolder} />
        </>
      )}
    </aside>
  );
};

export default SideBar;
