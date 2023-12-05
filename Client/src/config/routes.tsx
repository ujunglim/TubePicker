import Home from "../Pages/Home.tsx";
import WatchingVideo from "../Pages/WatchingVideo";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/watch/:id",
    element: <WatchingVideo />,
  },
];

export default routes;
