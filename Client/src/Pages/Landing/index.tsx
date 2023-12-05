import React, { useEffect } from "react";
import Login from "../../Component/Login";
import { gapi } from "gapi-script";

const Landing = () => {
  useEffect(() => {
    const start = () => {
      gapi.auth2.init({
        clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
        scope: "",
      });
    };

    gapi.load("client:auth2", start);
  }, []);

  return (
    <div>
      <Login />
    </div>
  );
};

export default Landing;
