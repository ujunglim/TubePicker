import { useNavigate } from "react-router";
import styles from "./index.module.scss";
import Logout from "../Component/Logout";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { appManage } from "../store/slices/app";

interface UserInfo {
  pic: string;
  name: string;
}

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(appManage);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const goToHome = () => {
    navigate("/home");
  };

  const getUserInfo = useCallback(() => {
    const cookie = getCookies();
    setUserInfo({
      name: cookie.userName,
      pic: cookie.userPic,
    });
  }, []);

  const getCookies = () => {
    var pairs = document.cookie.split(";");
    var cookies: any = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      cookies[(pair[0] + "").trim()] = unescape(pair.slice(1).join("="));
    }
    return cookies;
  };

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo, isLoggedIn]);

  return (
    <div className={styles.header}>
      <h1 className={styles.home_button} onClick={goToHome}>
        TubePicker
      </h1>
      {isLoggedIn && (
        <div className={styles.userInfo}>
          <span>{userInfo?.name}</span>
          <div className={styles.user_profile}>
            <img src={userInfo?.pic} alt="userPic" />
          </div>
        </div>
      )}
      {localStorage.getItem("login") && <Logout />}
    </div>
  );
};

export default Header;
