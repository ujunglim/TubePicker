import axios from "axios";

const Landing = () => {
  const handleClick = async () => {
    // dev
    // const response = await axios.post(
    //   "http://localhost:9090/google/get_login_url"
    // );

    // pro
    const response = await axios.post(
      "http://ec2-43-203-78-29.ap-northeast-2.compute.amazonaws.com:9090/google/get_login_url"
    );
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
