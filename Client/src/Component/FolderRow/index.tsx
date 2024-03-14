import styles from "./index.module.scss";
import { FC } from "react";
import { FaFolderOpen, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ModalType, Sub } from "../../Pages/Folders";

interface Prop {
  id: number;
  name: string;
  subList: string;
  handleDetail: (id: number) => void;
  handleEdit: (
    e: any,
    id: number,
    type: ModalType,
    name: string,
    subList: any
  ) => void;
  handleDelete: (e: any, id: number, type: ModalType) => void;
}

const FolderRow: FC<Prop> = ({
  id,
  name,
  subList,
  handleDetail,
  handleDelete,
  handleEdit,
}) => {
  return (
    <div className={styles.box} onClick={() => handleDetail(id)}>
      <div className={styles.detail}>
        <FaFolderOpen color="lightGrey" className={styles.folderIcon} />
        {name}
      </div>
      <div>
        <span onClick={(e) => handleEdit(e, id, ModalType.EDIT, name, subList)}>
          <FaEdit className={styles.icon} style={{ marginRight: "1rem" }} />
        </span>
        <span onClick={(e) => handleDelete(e, id, ModalType.DELETE)}>
          <MdDelete className={styles.icon} />
        </span>
      </div>
    </div>
  );
};

export default FolderRow;
