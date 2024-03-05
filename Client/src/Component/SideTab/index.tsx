import { FC } from "react";
import styles from "./index.module.scss";
import { FaFolderOpen } from "react-icons/fa";

interface Props {
  title: string;
  handleClick: () => void;
  isFolder?: boolean;
}
const SideTab: FC<Props> = ({ title, handleClick, isFolder = true }) => {
  return (
    <nav onClick={handleClick}>
      {isFolder && <FaFolderOpen className={styles.icon} />}
      <span>{title}</span>
    </nav>
  );
};

export default SideTab;
