import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router";

const clientId: string = process.env.REACT_APP_OAUTH_CLIENT_ID as string;

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = (res: any) => {
    localStorage.setItem("login", JSON.stringify(res.profileObj));
    navigate("/home");
  };

  const handleFailure = (res: any) => {
    console.log("failed!", res);
  };
  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={"single-host-origin"}
      isSignedIn={true}
    />
  );
};

export default Login;
