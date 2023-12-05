import Home from "../Pages/Home.tsx";
import Landing from "../Pages/Landing";
import WatchingVideo from "../Pages/WatchingVideo";

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
    path: "/watch/:id",
    element: <WatchingVideo />,
  },
];

export default routes;
