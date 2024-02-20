import styles from "./index.module.scss";
import { FC } from "react";
import { FaFolderOpen } from "react-icons/fa";

interface Prop {
  id: number;
  name: string;
  subList: string;
  handleDetail: any;
  handleDelete: any;
}

const FolderRow: FC<Prop> = ({
  id,
  name,
  subList,
  handleDetail,
  handleDelete,
}) => {
  return (
    <div className={styles.box} onClick={() => handleDetail(id)}>
      <div className={styles.detail}>
        <FaFolderOpen color="lightGrey" style={{ marginRight: "1rem" }} />
        {name}
      </div>
      <span onClick={() => handleDelete(id)}>delete</span>
    </div>
  );
};

export default FolderRow;
