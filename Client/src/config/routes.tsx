import DetailFolder from "../Pages/DetailFolder";
import Folders from "../Pages/Folders";
import Home from "../Pages/Home.tsx";
import Landing from "../Pages/Landing";
import NotFound from "../Pages/NotFound";

const routes = [
  {
    path: "/",
    element: <Home />,
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
  {
    path: "/notFound",
    element: <NotFound />,
  },
];

export default routes;
