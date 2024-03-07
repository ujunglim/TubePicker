import { useEffect, useState } from "react";
import Modal from "../../Component/Modal";
import { setModalPosition, setSelectedNav } from "../../store/slices/app";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import api from "../../api";
import FolderRow from "../../Component/FolderRow";
import styles from "./index.module.scss";
import ScrollContainer from "../../Component/ScrollContainer";
import { useNavigate } from "react-router";
import { folderManage, setFolderList } from "../../store/slices/folder";
import { fetchFolderList } from "../../api/folder";

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
  const [inputFolder, setInputFolder] = useState<string>("");
  const [inputChannel, setInputChannel] = useState<string>("");
  const [allSubList, setAllSubList] = useState<Sub[]>([]);
  const [subList, setSubList] = useState<Sub[]>([]);
  const [selectedSub, setSelectedSub] = useState<any>({});
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<Step>(Step.FIRST);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { folderList } = useSelector(folderManage);

  useEffect(() => {
    getAllSubList();
  }, []);

  const getAllSubList = async () => {
    const { data } = await api.get("/user/subChannelList");
    setAllSubList(data.subList);
    setSubList(data.subList);
  };
  const openModal = () => {
    dispatch(setModalPosition(window.scrollY));
  };

  const handleSearch = (e: any) => {
    const keyword = e.target.value.toLowerCase();
    setInputChannel(keyword);

    if (keyword !== "") {
      const filteredSubList = allSubList.filter(({ name }) =>
        name.toLowerCase().startsWith(keyword)
      );
      setSubList(filteredSubList);
    } else {
      setSubList(allSubList);
    }
  };

  const firstContent = (
    <label htmlFor="folderName">
      <input
        type="text"
        placeholder="폴더 이름을 입력하세요"
        value={inputFolder}
        onChange={(e) => setInputFolder(e.target.value)}
      ></input>
    </label>
  );

  const secondContent = (
    <div className={styles.secondContainer}>
      <label htmlFor="channelName">
        <input
          type="search"
          value={inputChannel}
          placeholder="채널 이름을 입력해주세요"
          onChange={handleSearch}
          style={{ marginBottom: "1.5rem" }}
        />
      </label>
      <ScrollContainer>
        {subList.length ? (
          subList.map((sub: Sub) => {
            return (
              <div
                key={sub.id}
                id={sub.id}
                className={styles.sublist}
                datatype={sub.name}
                onClick={(e) => handleSelectionSub(e)}
              >
                <label htmlFor="selectedChannel">
                  <input
                    type="checkbox"
                    datatype={sub.id}
                    value={sub.name}
                    checked={selectedSub[sub.name]}
                  />
                </label>
                <div className={styles.user_profile}>
                  <img
                    src={sub.img}
                    alt="channel img"
                    style={{ width: "30px" }}
                  />
                </div>
                <div>{sub.name}</div>
              </div>
            );
          })
        ) : (
          <div className={styles.noMatch}>매치되는 채널이 없습니다</div>
        )}
      </ScrollContainer>
    </div>
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

  const inputFolderName = async () => {
    // valid
    if (inputFolder === "") {
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
      name: inputFolder,
      list: selectedSub,
    });
    dispatch(setFolderList(data));
    toast.info("와우 폴더생성을 성공했습니다!");
    handleModalClose();
  };

  const askDelete = (e: any, id: string) => {
    e.stopPropagation(); // 이벤트버블링 방지
    setDeletingFolderId(id);
    console.log("is deleting");
    dispatch(setModalPosition(window.scrollY));
  };

  const deleteFolder = async () => {
    await api.delete("/folder", { data: { id: deletingFolderId } });
    const newFolderList = await fetchFolderList();
    dispatch(setFolderList(newFolderList));
    handleModalClose();
  };

  const detailFolder = async (id: string) => {
    handleModalClose();
    navigate(`/folders/detail/${id}`);
    dispatch(setSelectedNav(id));
  };

  const renderModalTitle = () => {
    if (deletingFolderId) return "폴더를 삭제하시겠습니까?";
    if (modalStep === Step.FIRST) return "새 폴더를 생성하시겠습니까?";
    if (modalStep === Step.SECOND) return "구독채널을 선택해주세요";
    return "";
  };

  const renderModalChildren = () => {
    if (deletingFolderId) return <></>;
    if (modalStep === Step.FIRST) return firstContent;
    if (modalStep === Step.SECOND) return secondContent;
  };

  const handleModalOk = () => {
    if (deletingFolderId) {
      deleteFolder();
      return;
    }
    if (modalStep === Step.FIRST) inputFolderName();
    if (modalStep === Step.SECOND) createFolder();
  };

  const handleModalClose = () => {
    // 폴더삭제
    if (deletingFolderId) {
      setDeletingFolderId(null);
    } else {
      // 폴더추가
      setInputFolder("");
      setInputChannel("");
      setModalStep(Step.FIRST);
      setSelectedSub({});
    }
    dispatch(setModalPosition(undefined));
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
            handleDetail={detailFolder}
            handleDelete={askDelete}
          />
        ))}
        <Modal
          title={renderModalTitle()}
          children={renderModalChildren()}
          handleOk={handleModalOk}
          handleClose={handleModalClose}
        />
      </div>
    </div>
  );
};

export default Folders;
