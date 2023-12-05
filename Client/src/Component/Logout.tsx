import { GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router";

const clientId: string = process.env.REACT_APP_OAUTH_CLIENT_ID as string;

const Logout = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    localStorage.removeItem("login");
    navigate("/");
  };

  return (
    <GoogleLogout
      clientId={clientId}
      buttonText="Logout"
      onLogoutSuccess={handleSuccess}
    />
  );
};

export default Logout;
