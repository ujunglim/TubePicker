import { FC } from "react";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { appManage } from "../../store/slices/app";
import { IoMdClose } from "react-icons/io";
interface Prop {
  title: string;
  children: any; ////////////////////////////////
  handleClose: () => void;
  handleOk: () => void;
}
const Modal: FC<Prop> = ({ title, children, handleClose, handleOk }) => {
  const { modalPosition } = useSelector(appManage);

  return modalPosition === undefined ? null : (
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
  );
};

export default Modal;
