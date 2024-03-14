import React, { FC, useEffect, useState } from "react";
import Modal from "../../Component/Modal";
import ScrollContainer from "../../Component/ScrollContainer";
import styles from "./index.module.scss";
import { setModalPosition } from "../../store/slices/app";
import { toast } from "react-toastify";
import { setFolderList } from "../../store/slices/folder";
import api from "../../api";
import { useDispatch } from "react-redux";
import { Sub } from ".";
import { VscSearch } from "react-icons/vsc";

export enum Step {
  FIRST = "first",
  SECOND = "second",
}

interface Prop {
  allSubList: Sub[];
  onClose: () => void;
}

const CreateModal: FC<Prop> = ({ allSubList, onClose }) => {
  const [folderName, setFolderName] = useState<string>("");
  const [searchingName, setSearchingName] = useState<string>("");
  const [channelList, setChannelList] = useState<Sub[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<any>({});
  const [modalStep, setModalStep] = useState<Step>(Step.FIRST);
  const dispatch = useDispatch();

  useEffect(() => {
    setChannelList(allSubList);
  }, [allSubList]);

  const handleSearch = (e: any) => {
    const keyword = e.target.value.toLowerCase();
    setSearchingName(keyword);

    if (keyword !== "") {
      const filteredSubList = allSubList.filter(({ name }) =>
        name.toLowerCase().startsWith(keyword)
      );
      setChannelList(filteredSubList);
    } else {
      setChannelList(allSubList);
    }
  };

  const handleSelectionSub = (e: any) => {
    const target = e.currentTarget;
    const name = target.getAttribute("datatype");
    const id = target.id;
    const newSelection = { ...selectedChannels };
    if (selectedChannels[name]) {
      delete newSelection[name];
    } else {
      newSelection[name] = id;
    }
    setSelectedChannels(newSelection);
  };

  const firstContent = (
    <label htmlFor="folderName">
      <input
        type="text"
        placeholder="폴더 이름을 입력하세요"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
    </label>
  );

  const secondContent = (
    <div className={styles.secondContainer}>
      <label htmlFor="channelName">
        <VscSearch className={styles.searchIcon} />
        <input
          type="search"
          value={searchingName}
          placeholder="채널 이름을 검색하세요"
          onChange={handleSearch}
          className={styles.search}
        />
      </label>
      <ScrollContainer>
        {channelList.length ? (
          channelList.map((sub: Sub) => {
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
                    checked={selectedChannels[sub.name]}
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
          <div className={styles.noMatch}>
            <img src="/img/no_result.png" alt="no_result" />
            채널이 존재하지 않습니다
          </div>
        )}
      </ScrollContainer>
    </div>
  );

  const renderModalTitle = () => {
    if (modalStep === Step.FIRST) return "새 폴더를 생성하시겠습니까?";
    if (modalStep === Step.SECOND) return "채널을 선택해주세요";
  };

  const handleModalClose = () => {
    onClose();
    setFolderName("");
    setSearchingName("");
    setModalStep(Step.FIRST);
    setSelectedChannels({});
    dispatch(setModalPosition(undefined));
  };

  const createFolder = async () => {
    // try {} catch
    if (!Object.keys(selectedChannels).length) {
      toast.error("채널을 1개 이상 선택해주세요");
      return;
    }
    const { data } = await api.post("/folder", {
      name: folderName,
      list: selectedChannels,
    });
    dispatch(setFolderList(data));
    toast.info("와우 폴더생성을 성공했습니다!");
    handleModalClose();
  };

  const handleModalOk = () => {
    if (modalStep === Step.FIRST) inputFolderName();
    if (modalStep === Step.SECOND) createFolder();
  };

  const inputFolderName = async () => {
    // valid
    if (folderName === "") {
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

export default CreateModal;
