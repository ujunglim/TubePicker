import { useEffect, useState } from "react";
import { setModalPosition, setSelectedNav } from "../../store/slices/app";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import api from "../../api";
import FolderRow from "../../Component/FolderRow";
import styles from "./index.module.scss";
import { useNavigate } from "react-router";
import { folderManage } from "../../store/slices/folder";
import CreateModal from "./CreateModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { FaPlus } from "react-icons/fa";

export interface Sub {
  id: string;
  name: string;
  img: string;
}

export enum ModalType {
  CREATE,
  DELETE,
  EDIT,
}

const Folders = () => {
  const [allSubList, setAllSubList] = useState<Sub[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false); // 폴더생성
  const [deletingId, setDeletingId] = useState<number | null>(null); // 폴더삭제
  const [editingInfo, setEditingInfo] = useState<any | null>(null); // 폴더수정

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { folderList } = useSelector(folderManage);

  useEffect(() => {
    getAllSubList();
  }, []);

  const getAllSubList = async () => {
    const { data } = await api.get("/user/subChannelList");
    setAllSubList(data.subList);
  };

  // 모달열기
  const showModal = async (
    e?: Event,
    id?: number,
    type: ModalType = ModalType.CREATE,
    name?: string,
    subList?: Sub[]
  ) => {
    e && e.stopPropagation(); // 이벤트버블링 방지
    if (type === ModalType.CREATE) setIsCreating(true);
    if (type === ModalType.DELETE && id) setDeletingId(id);
    if (type === ModalType.EDIT && id) setEditingInfo({ id, name, subList });
    dispatch(setModalPosition(window.scrollY));
  };

  const detailFolder = async (id: number) => {
    handleModalClose();
    navigate(`/folders/detail/${id}`);
    dispatch(setSelectedNav(id));
  };

  const handleModalClose = () => {
    // 폴더삭제
    if (deletingId) {
      setDeletingId(null);
    }
    dispatch(setModalPosition(undefined));
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div style={{ display: "flex", flexFlow: "column" }}>
        <button onClick={() => showModal()} className={styles.createBtn}>
          <FaPlus className={styles.plusIcon} />새 폴더 생성
        </button>
        {folderList?.map(({ id, name, subList }) => (
          <FolderRow
            id={id}
            name={name}
            subList={subList}
            handleDetail={detailFolder}
            handleEdit={showModal}
            handleDelete={showModal}
          />
        ))}
        {isCreating && (
          <CreateModal
            allSubList={allSubList}
            onClose={() => setIsCreating(false)}
          />
        )}
        {deletingId && (
          <DeleteModal id={deletingId} onClose={() => setDeletingId(null)} />
        )}
        {editingInfo && (
          <EditModal
            info={editingInfo}
            onClose={() => setEditingInfo(null)}
            allSubList={allSubList}
          />
        )}
      </div>
    </div>
  );
};

export default Folders;
