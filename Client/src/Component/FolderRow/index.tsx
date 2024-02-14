import styles from "./index.module.scss";
import { FC } from "react";
import { FaFolderOpen } from "react-icons/fa";

interface Prop {
  id: number;
  name: string;
  subList: string;
  handleDelete: any;
}

const FolderRow: FC<Prop> = ({ id, name, subList, handleDelete }) => {
  return (
    <div className={styles.box}>
      <div className={styles.detail}>
        <FaFolderOpen color="lightGrey" style={{ marginRight: "1rem" }} />
        {name}
      </div>
      <span onClick={() => handleDelete(id)}>delete</span>
    </div>
  );
};

export default FolderRow;
