import { useNavigate } from "react-router";
import "./index.less";

const Header = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className={"header"}>
      <h1 className="home_button" onClick={handleClick}>
        🍒TubePicker
      </h1>
    </div>
  );
};

export default Header;
