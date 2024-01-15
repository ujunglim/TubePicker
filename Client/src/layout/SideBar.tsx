import { useNavigate } from "react-router";
import styles from "./index.module.scss";
import SideTab from "../Component/SideTab";

const SideBar = () => {
  const navigate = useNavigate();

  const handleFolder = () => {
    navigate("/folders");
  };
  return (
    <div className={styles.sidebar}>
      <SideTab title={"Folders"} handleClick={handleFolder} />
    </div>
  );
};

export default SideBar;
