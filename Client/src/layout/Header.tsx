import { useNavigate } from "react-router";
import "./index.less";
import Logout from "../Component/Logout";

const Header = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <div className={"header"}>
      <h1 className="home_button" onClick={goToHome}>
        TubePicker
      </h1>
      {localStorage.getItem("login") && <Logout />}
    </div>
  );
};

export default Header;
