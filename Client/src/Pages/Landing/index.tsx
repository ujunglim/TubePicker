import api from "../../api";
import styles from "./index.module.scss";
import { FaGoogle } from "react-icons/fa";

const Landing = () => {
  const handleLogin = async () => {
    const response = await api.post("/google/get_login_url");
    const { auth2Url } = response.data;
    window.location.href = auth2Url;
    localStorage.setItem("login", "true");
  };

  return (
    <div className={styles.container}>
      <div style={{ width: " 80%" }}>
        <div className={styles.heroDiv}>
          <div style={{ marginBottom: "3rem" }}>
            <h1 className={styles.title}>TubePicker</h1>
            <p>group your youtube channels by folder</p>
          </div>
          <button onClick={handleLogin}>
            <span className={styles.visible}>
              <FaGoogle className={styles.loginIcon} />
              <span className={styles.invisible}>Google 계정으로 로그인</span>
            </span>
          </button>
        </div>
        <div className={styles.line}></div>
        <section>
          <img src="/img/1.gif" alt="gif1" />
          <span>
            After login by Google, TubePicker will Get your subscribed channels
          </span>
        </section>
        <section>
          <span>Create folders to Group Channels by Interest</span>
          <img src="/img/2.gif" alt="gif2" />
        </section>
        <section>
          <img src="/img/3.gif" alt="gif3" />
          <span>Explore the Latest Videos from your Folders</span>
        </section>
      </div>
    </div>
  );
};

export default Landing;
