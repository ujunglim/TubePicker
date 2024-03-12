import React, { FC } from "react";
import Modal from "../../Component/Modal";
import api from "../../api";
import { fetchFolderList } from "../../api/folder";
import { setModalPosition } from "../../store/slices/app";
import { useDispatch } from "react-redux";
import { setFolderList } from "../../store/slices/folder";

interface Props {
  id: number | null;
  onClose: () => void;
}

const DeleteModal: FC<Props> = ({ id, onClose }) => {
  const dispatch = useDispatch();

  const deleteFolder = async () => {
    await api.delete("/folder", { data: { id } });
    const newFolderList = await fetchFolderList();
    dispatch(setFolderList(newFolderList));
    closeModal();
  };

  const closeModal = () => {
    onClose();
    dispatch(setModalPosition(undefined));
  };

  return (
    <Modal
      title="폴더를 삭제하시겠습니까?"
      children={<></>}
      handleOk={deleteFolder}
      handleClose={closeModal}
    />
  );
};

export default DeleteModal;
