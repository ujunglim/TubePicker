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
    <nav>
      {isLoggedIn && <SideTab title={"Folders"} handleClick={handleFolder} />}
    </nav>
  );
};

export default SideBar;
