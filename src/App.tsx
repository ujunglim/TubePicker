import { useRoutes } from "react-router";
import AppLayout from "./layout";
import routes from "./config/routes";
import Login from "./Component/Login";
import Logout from "./Component/Logout";
import { useEffect } from "react";
import { gapi } from "gapi-script";

const clientId =
  "94751456728-the57pbcnud2pgto7gscjplb5ntik8ae.apps.googleusercontent.com";
function App() {
  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId,
        scope: "",
      });
    };

    gapi.load("client:auth2", start);
  }, []);

  return (
    <>
      <Login />
      <Logout />
      <AppLayout>{useRoutes(routes)}</AppLayout>
    </>
  );
}

export default App;
