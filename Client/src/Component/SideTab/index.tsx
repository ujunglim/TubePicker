import { FC } from "react";
import styles from "./index.module.scss";
import { FaFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { appManage, setSelectedNav } from "../../store/slices/app";

interface Props {
  id: string;
  title: string;
  isFolder?: boolean;
}
const SideTab: FC<Props> = ({ id, title, isFolder = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedNav } = useSelector(appManage);

  const handleNav = () => {
    dispatch(setSelectedNav(id));

    if (id === "folder") navigate("/folders"); // 폴더만들기 tab
    if (id === "liked") navigate("/home"); // 좋아요 영상 tab
    // detail 폴더 side tab일때
    if (!isNaN(Number(id))) {
      navigate(`/folders/detail/${id}`);
    }
  };

  return (
    <nav
      id={id}
      onClick={handleNav}
      style={{
        background: selectedNav === id ? "rgb(243, 243, 243)" : "none",
      }}
    >
      {isFolder && <FaFolderOpen className={styles.icon} />}
      <span style={{ marginLeft: id === "folder" ? "40px" : "0px" }}>
        {title}
      </span>
    </nav>
  );
};

export default SideTab;
