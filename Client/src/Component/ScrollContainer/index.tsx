import { FC } from "react";
import styles from "./index.module.scss";

interface prop {
  children: any;
}

const ScrollContainer: FC<prop> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default ScrollContainer;
