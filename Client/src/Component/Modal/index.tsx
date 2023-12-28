import { FC } from "react";
import "./index.less";
interface Prop {
  title: string;
  content: any; ////////////////////////////////
  handleOk: () => void;
}
const Modal: FC<Prop> = ({ title, content, handleOk }) => {
  console.log(content);
  return (
    <div className="modal">
      <div className="header">
        <p>{title}</p>
        <button>x</button>
      </div>
      <div>{content}</div>
      <button onClick={handleOk}>OK</button>
    </div>
  );
};

export default Modal;
