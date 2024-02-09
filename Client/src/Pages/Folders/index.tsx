import { useEffect, useState } from "react";
import Modal from "../../Component/Modal";
import { setModalPosition } from "../../store/slices/app";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import api from "../../api";
import FolderRow from "../../Component/FolderRow";
import styles from "./index.module.scss";

const Folders = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [folderList, setFolderList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getFolderList();
  }, []);

  const getFolderList = async () => {
    const { data } = await api.get("/folder");
    setFolderList(data);
  };

  const openModal = () => {
    dispatch(setModalPosition(window.scrollY));
  };

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const content = (
    <input
      type="text"
      placeholder="폴더 이름을 입력하세요"
      value={inputValue}
      onChange={handleChange}
    ></input>
  );

  const handleClose = () => {
    setInputValue("");
    dispatch(setModalPosition(undefined));
  };

  const createFolder = async () => {
    // valid
    if (inputValue === "") {
      toast.error("폴더 이름을 입력해주세요");
      return;
    }
    // create folder
    await api.post("/folder", {
      name: inputValue,
    });
    getFolderList();
    toast.info("와우 폴더생성을 성공했습니다!");
    handleClose();
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div style={{ display: "flex", flexFlow: "column" }}>
        <button onClick={openModal} className={styles.createBtn}>
          새 폴더 생성
        </button>
        {folderList.map(({ id, name, subList }) => (
          <FolderRow id={id} name={name} subList={subList} />
        ))}
        <Modal
          title={"새 폴더를 생성하시겠습니까?"}
          children={content}
          handleOk={createFolder}
          handleClose={handleClose}
        />
      </div>
    </div>
  );
};

export default Folders;
