import React, { FC, useEffect, useState } from "react";
import Modal from "../../Component/Modal";
import ScrollContainer from "../../Component/ScrollContainer";
import styles from "./index.module.scss";
import { setModalPosition } from "../../store/slices/app";
import { toast } from "react-toastify";
import { setFolderList } from "../../store/slices/folder";
import api from "../../api";
import { Sub } from ".";
import { useDispatch } from "react-redux";

enum Step {
  FIRST = "first",
  SECOND = "second",
}

interface Prop {
  info: any;
  allSubList: Sub[];
  onClose: () => void;
}

const EditModal: FC<Prop> = ({ info, allSubList, onClose }) => {
  const [inputFolder, setInputFolder] = useState<string>(""); // 폴더이름
  const [inputChannel, setInputChannel] = useState<string>(""); // 검색하는 채널이름
  const [subList, setSubList] = useState<Sub[]>([]); // 전체 채널
  const [selectedSub, setSelectedSub] = useState<any>({}); // 선택한 채널
  const [modalStep, setModalStep] = useState<Step>(Step.FIRST);
  const dispatch = useDispatch();

  useEffect(() => {
    setInputFolder(info.name); // 기존 폴더이름
    setSelectedSub(info.subList); // 기존 선택한 채널
    setSubList(allSubList); // 구독하는 전체채널
  }, [allSubList, info, info.name, info.subList]);

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

  const renderModalTitle = () => {
    if (modalStep === Step.FIRST) return "폴더이름을 수정해주세요";
    if (modalStep === Step.SECOND) return "구독채널을 수정해주세요";
  };

  const handleModalClose = () => {
    onClose();
    setInputFolder("");
    setInputChannel("");
    setModalStep(Step.FIRST);
    setSelectedSub({});
    dispatch(setModalPosition(undefined));
  };

  const editFolder = async () => {
    // try {} catch
    if (!Object.keys(selectedSub).length) {
      toast.error("채널을 1개 이상 선택해주세요");
      return;
    }
    // TODO
    const { data } = await api.post("/folder", {
      name: inputFolder,
      list: selectedSub,
    });
    dispatch(setFolderList(data));
    toast.info("와우 폴더수정을 성공했습니다!");
    handleModalClose();
  };

  const handleModalOk = () => {
    if (modalStep === Step.FIRST) inputFolderName();
    if (modalStep === Step.SECOND) editFolder();
  };

  const inputFolderName = async () => {
    // valid
    if (inputFolder === "") {
      toast.error("폴더 이름을 입력해주세요");
      return;
    }
    setModalStep(Step.SECOND);
  };

  return (
    <Modal
      title={renderModalTitle()}
      children={modalStep === Step.FIRST ? firstContent : secondContent}
      handleOk={handleModalOk}
      handleClose={handleModalClose}
    />
  );
};

export default EditModal;
