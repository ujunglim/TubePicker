import { FC, ReactNode } from "react";
import { useCallback, useEffect } from "react";
import styles from "./index.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { appManage, setModalPosition } from "../../store/slices/app";
import { IoMdClose } from "react-icons/io";
import ModalVideo from "../ModalVideo";

export enum ModalType {
  VIDEO = "video",
  FOLDER = "folder",
}
interface Prop {
  type?: ModalType;
  title?: string;
  children?: ReactNode;
  handleClose?: () => void;
  handleOk?: () => void;

  id?: string;
  channelTitle?: string;
  description?: string;
  publishedAt?: string;
  thumbnails?: string;
}
const Modal: FC<Prop> = ({
  type = ModalType.FOLDER,
  title = "",
  children,
  handleClose,
  handleOk,
  id,
}) => {
  const { modalPosition } = useSelector(appManage);
  const dispatch = useDispatch();

  const closeMask = useCallback(() => {
    dispatch(setModalPosition(undefined));
    document.body.style.position = ""; // 스크롤바 적용
    window.scrollTo({ top: modalPosition }); // 스크롤바를 기존의 위치로
    document.body.style.paddingRight = "0px"; // 화면의 흔들림 커버
    handleClose && handleClose();
  }, [dispatch, handleClose, modalPosition]);

  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMask();
      }
    });

    return () => {
      window.removeEventListener("keydown", () => closeMask());
    };
  }, [closeMask]);

  return modalPosition === undefined ? null : (
    <div className={styles.container}>
      {modalPosition !== undefined && (
        <div className={styles.mask} onClick={closeMask}></div>
      )}
      {type === ModalType.VIDEO ? (
        <ModalVideo
          id={id}
          title={title}
          // channelTitle={}
          // description={}
          // publishedAt={}
          // thumbnails={}
        />
      ) : (
        <div className={styles.modal}>
          <div className={styles.header}>
            <p className={styles.title}>{title}</p>
            <button className={styles.closeBtn} onClick={handleClose}>
              <IoMdClose />
            </button>
          </div>
          <div className={styles.children}>{children}</div>
          <footer>
            <button onClick={handleClose} className={styles.cancelBtn}>
              취소
            </button>
            <button onClick={handleOk}>확인</button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Modal;
