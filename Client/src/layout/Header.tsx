import { useNavigate } from "react-router";
import styles from "./index.module.scss";
import Logout from "../Component/Logout";

const Header = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.home_button} onClick={goToHome}>
        TubePicker
      </h1>
      {localStorage.getItem("login") && <Logout />}
    </div>
  );
};

export default Header;
