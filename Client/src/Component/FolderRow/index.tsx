import styles from "./index.module.scss";
import { FC } from "react";
import { FaFolderOpen } from "react-icons/fa";

interface Prop {
  id: number;
  name: string;
  subList: string;
}

const FolderRow: FC<Prop> = ({ name, subList }) => {
  return (
    <div className={styles.box}>
      <FaFolderOpen color="lightGrey" style={{ marginRight: "1rem" }} />
      {name}
    </div>
  );
};

export default FolderRow;
