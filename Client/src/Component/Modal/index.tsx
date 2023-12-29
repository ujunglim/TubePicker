import { FC } from "react";
import styles from "./index.module.scss";
interface Prop {
  title: string;
  content: any; ////////////////////////////////
  handleOk: () => void;
}
const Modal: FC<Prop> = ({ title, content, handleOk }) => {
  console.log(content);
  return (
    <div className={styles.modal}>
      <div className={styles.header}>
        <p>{title}</p>
        <button>x</button>
      </div>
      <div>{content}</div>
      <button onClick={handleOk}>OK</button>
    </div>
  );
};

export default Modal;
