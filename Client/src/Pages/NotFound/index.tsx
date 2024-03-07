import React from "react";
import { useNavigate } from "react-router";
import errorIMG from "./error.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexFlow: "column",
        width: "100%",
      }}
    >
      <img src={errorIMG} alt="404" style={{ width: "300px" }} />
      <div>가능한 유튜브 요청량을 초과했습니다. 잠시후 다시 시도해주세요 </div>
      <button onClick={() => navigate("/")} style={{ marginTop: "3rem" }}>
        홈으로
      </button>
    </div>
  );
};

export default NotFound;
