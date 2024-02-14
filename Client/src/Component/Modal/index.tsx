import { FC } from "react";
import { useCallback, useEffect } from "react";
import styles from "./index.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { appManage, setModalPosition } from "../../store/slices/app";
import { IoMdClose } from "react-icons/io";
interface Prop {
  title: string;
  children: any; ////////////////////////////////
  handleClose: () => void;
  handleOk: () => void;
}
const Modal: FC<Prop> = ({ title, children, handleClose, handleOk }) => {
  const { modalPosition } = useSelector(appManage);
  const dispatch = useDispatch();

  const closeMask = useCallback(() => {
    dispatch(setModalPosition(undefined));
    document.body.style.position = ""; // 스크롤바 적용
    window.scrollTo({ top: modalPosition }); // 스크롤바를 기존의 위치로
    document.body.style.paddingRight = "0px"; // 화면의 흔들림 커버
    handleClose();
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
      <div className={styles.modal}>
        <div className={styles.header}>
          <p className={styles.title}>{title}</p>
          <button className={styles.closeBtn} onClick={handleClose}>
            <IoMdClose />
          </button>
        </div>
        <div className={styles.children}>{children}</div>
        <div className={styles.footer}>
          <button onClick={handleOk}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
