import { GoogleLogout } from "react-google-login";

const clientId =
  "94751456728-the57pbcnud2pgto7gscjplb5ntik8ae.apps.googleusercontent.com";

const Logout = () => {
  const handleSuccess = () => {
    console.log("log out successful");
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
