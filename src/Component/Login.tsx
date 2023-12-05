import GoogleLogin from "react-google-login";

const clientId =
  "94751456728-the57pbcnud2pgto7gscjplb5ntik8ae.apps.googleusercontent.com";

const Login = () => {
  const handleSuccess = (res: any) => {
    console.log("successed!", res.profileObj);
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
