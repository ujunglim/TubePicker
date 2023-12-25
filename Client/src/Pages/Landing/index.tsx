import axios from "axios";

const Landing = () => {
  const handleClick = async () => {
    const response = await axios.post(
      "http://localhost:9090/google/get_login_url"
    );
    console.log(
      "responses from http://localhost:9090/google/get_login_url",
      response.data
    );
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
