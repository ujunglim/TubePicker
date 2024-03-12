import { useNavigate } from "react-router";
import api from "../../api";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login") === "true") {
      navigate("/home");
    }
  }, []);

  const handleClick = async () => {
    const response = await api.post("/google/get_login_url");
    const { auth2Url } = response.data;
    window.location.href = auth2Url;
  };

  return (
    <div>
      <button onClick={handleClick}>Login with Google</button>
    </div>
  );
};

export default Landing;
