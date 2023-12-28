import { useState } from "react";
import Modal from "../../Component/Modal";
import { setModalPosition } from "../../store/slices/app";
import { useDispatch } from "react-redux";

const Folders = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const dispatch = useDispatch();
  const openModal = () => {
    dispatch(setModalPosition(window.scrollY));
  };
  const createFolder = () => {};
  const content = <input type="text" placeholder="이름을 입력하세요"></input>;
  return (
    <div style={{ display: "flex", flexFlow: "column" }}>
      <button onClick={openModal}>새 폴더 생성</button>
      <Modal
        title={"새 폴더를 생성하시겠습니까?"}
        content={content}
        handleOk={createFolder}
      />
    </div>
  );
};

export default Folders;
