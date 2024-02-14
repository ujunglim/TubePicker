import Header from "./Header";
import SideBar from "./SideBar";
import styles from "./index.module.scss";
import { FC } from "react";

interface prop {
  children: any;
}

const AppLayout: FC<prop> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <SideBar />
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
