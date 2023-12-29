import { useState } from "react";
import Modal from "../../Component/Modal";
import { setModalPosition } from "../../store/slices/app";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const Folders = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const dispatch = useDispatch();
  const openModal = () => {
    dispatch(setModalPosition(window.scrollY));
  };

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const content = (
    <input
      type="text"
      placeholder="이름을 입력하세요"
      value={inputValue}
      onChange={handleChange}
    ></input>
  );

  const handleClose = () => {
    setInputValue("");
    dispatch(setModalPosition(undefined));
  };

  const createFolder = () => {
    // valid
    if (inputValue === "") {
      toast.error("이름을 입력해주세요");
      return;
    }
    // api/create/folder
    toast.info("와우 폴더생성을 성공했습니다!");
    handleClose();
  };

  return (
    <>
      <ToastContainer />
      <div style={{ display: "flex", flexFlow: "column" }}>
        <button onClick={openModal}>새 폴더 생성</button>
        <Modal
          title={"새 폴더를 생성하시겠습니까?"}
          children={content}
          handleOk={createFolder}
          handleClose={handleClose}
        />
      </div>
    </>
  );
};

export default Folders;
