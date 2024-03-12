import { useNavigate } from "react-router";
import styles from "./index.module.scss";
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setSelectedNav } from "../store/slices/app";
import getCookies from "../utils/getCookies";

interface UserInfo {
  pic: string;
  name: string;
}

const Header = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const dispatch = useDispatch();

  const goToHome = () => {
    navigate("/home");
    dispatch(setSelectedNav("liked"));
  };

  const getUserInfo = useCallback(() => {
    const cookie = getCookies();
    setUserInfo({
      name: cookie.userName,
      pic: cookie.userPic,
    });
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <header>
      <h1 className={styles.home_button} onClick={goToHome}>
        TubePicker
      </h1>
      {localStorage.getItem("login") === "true" && (
        <div className={styles.userInfo}>
          <span>{userInfo?.name}</span>
          <div className={styles.user_profile}>
            <img src={userInfo?.pic} alt="userPic" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
