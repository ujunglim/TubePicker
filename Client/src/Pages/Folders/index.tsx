import { useEffect, useState } from "react";
import Modal from "../../Component/Modal";
import { setModalPosition } from "../../store/slices/app";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import api from "../../api";
import FolderRow from "../../Component/FolderRow";
import styles from "./index.module.scss";
import ScrollContainer from "../../Component/ScrollContainer";

enum Step {
  FIRST = "first",
  SECOND = "second",
}

interface Sub {
  id: string;
  name: string;
  img: string;
}

const Folders = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [subList, setSubList] = useState<Sub[]>([]);
  const [folderList, setFolderList] = useState([]);
  const [selectedSub, setSelectedSub] = useState(new Set());
  const [modalStep, setModalStep] = useState<Step>(Step.FIRST);
  const dispatch = useDispatch();

  useEffect(() => {
    getFolderList();
    getSubscriptionList();
  }, []);

  const getFolderList = async () => {
    const { data } = await api.get("/folder");
    setFolderList(data);
  };
  const getSubscriptionList = async () => {
    const { data } = await api.get("/subscriptionList");
    setSubList(data.subList);
  };
  const openModal = () => {
    dispatch(setModalPosition(window.scrollY));
  };

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const firstContent = (
    <input
      type="text"
      placeholder="폴더 이름을 입력하세요"
      value={inputValue}
      onChange={handleChange}
    ></input>
  );

  const secondContent = (
    <ScrollContainer>
      {subList.map((sub: Sub) => {
        return (
          <div
            id={sub.id}
            className={styles.sublist}
            onClick={(e) => handleSelectionSub(e)}
          >
            <input type="checkbox" value={sub.id} />
            <div className={styles.user_profile}>
              <img src={sub.img} alt="channel img" />
            </div>
            <div>{sub.name}</div>
          </div>
        );
      })}
    </ScrollContainer>
  );

  const handleSelectionSub = (e: any) => {
    const selectedId = e.target.value;
    if (selectedSub.has(selectedId)) {
      selectedSub.delete(selectedId);
    } else {
      selectedSub.add(selectedId);
    }
  };

  const handleClose = () => {
    setInputValue("");
    dispatch(setModalPosition(undefined));
  };

  const setFolderName = async () => {
    // valid
    if (inputValue === "") {
      toast.error("폴더 이름을 입력해주세요");
      return;
    }
    setModalStep(Step.SECOND);
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
      // list: ,
    });
    getFolderList();
    toast.info("와우 폴더생성을 성공했습니다!");
    handleClose();
    setModalStep(Step.FIRST);
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
          title={
            modalStep === Step.FIRST
              ? "새 폴더를 생성하시겠습니까?"
              : "구독채널을 선택해주세요"
          }
          children={modalStep === Step.FIRST ? firstContent : secondContent}
          handleOk={modalStep === Step.FIRST ? setFolderName : createFolder}
          handleClose={handleClose}
        />
      </div>
    </div>
  );
};

export default Folders;
