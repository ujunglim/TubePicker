import { useLocation } from "react-router";
import Landing from "../Pages/Landing";
import Header from "./Header";
import SideBar from "./SideBar";
import styles from "./index.module.scss";
import { FC } from "react";

interface prop {
  children: any;
}

const AppLayout: FC<prop> = ({ children }) => {
  const location = useLocation();

  return (
    <div className={styles.layout}>
      {location.pathname === "/" ? (
        <Landing />
      ) : (
        <>
          <Header />
          <div className={styles.content}>
            <SideBar />
            <main>{children}</main>
          </div>
        </>
      )}
    </div>
  );
};

export default AppLayout;
