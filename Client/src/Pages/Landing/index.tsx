import api from "../../api";

const Landing = () => {
  const handleClick = async () => {
    const response = await api.post("/google/get_login_url");
    console.log(response.data);
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
