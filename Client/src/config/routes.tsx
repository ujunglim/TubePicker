import DetailFolder from "../Pages/DetailFolder";
import Folders from "../Pages/Folders";
import Home from "../Pages/Home.tsx";
import Landing from "../Pages/Landing";

const routes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/folders",
    element: <Folders />,
  },
  {
    path: "/folders/detail/:id",
    element: <DetailFolder />,
  },
];

export default routes;
