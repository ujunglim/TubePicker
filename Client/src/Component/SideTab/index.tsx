import { FC } from "react";
import styles from "./index.module.scss";
interface Props {
  title: string;
  handleClick: () => void;
}
const SideTab: FC<Props> = ({ title, handleClick }) => {
  return (
    <div className={styles.tab} onClick={handleClick}>
      {title}
    </div>
  );
};

export default SideTab;
