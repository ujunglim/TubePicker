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
  const [selectedSub, setSelectedSub] = useState<any>({});
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
            key={sub.id}
            id={sub.id}
            className={styles.sublist}
            datatype={sub.name}
            onClick={(e) => handleSelectionSub(e)}
          >
            <input
              type="checkbox"
              datatype={sub.id}
              value={sub.name}
              checked={selectedSub[sub.name]}
            />
            <div className={styles.user_profile}>
              <img src={sub.img} alt="channel img" style={{ width: "30px" }} />
            </div>
            <div>{sub.name}</div>
          </div>
        );
      })}
    </ScrollContainer>
  );

  const handleSelectionSub = (e: any) => {
    const target = e.currentTarget;
    const name = target.getAttribute("datatype");
    const id = target.id;
    const newSelection = { ...selectedSub };
    if (selectedSub[name]) {
      delete newSelection[name];
    } else {
      newSelection[name] = id;
    }
    setSelectedSub(newSelection);
  };

  const handleClose = () => {
    setInputValue("");
    setModalStep(Step.FIRST);
    setSelectedSub({});
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
    // try {} catch
    if (!Object.keys(selectedSub).length) {
      toast.error("채널을 1개 이상 선택해주세요");
      return;
    }
    const { data } = await api.post("/folder", {
      name: inputValue,
      list: selectedSub,
    });
    setFolderList(data);
    toast.info("와우 폴더생성을 성공했습니다!");
    handleClose();
  };

  const deleteFolder = async (id: string) => {
    await api.delete("/folder", { data: { id } });
    getFolderList();
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div style={{ display: "flex", flexFlow: "column" }}>
        <button onClick={openModal} className={styles.createBtn}>
          새 폴더 생성
        </button>
        {folderList?.map(({ id, name, subList }) => (
          <FolderRow
            id={id}
            name={name}
            subList={subList}
            handleDelete={deleteFolder}
          />
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
