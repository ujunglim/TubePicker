import Landing from "../Pages/Landing";
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
      {localStorage.getItem("login") === "true" ? (
        <>
          <Header />
          <div className={styles.content}>
            <SideBar />
            <main>{children}</main>
          </div>
        </>
      ) : (
        <Landing />
      )}
    </div>
  );
};

export default AppLayout;
