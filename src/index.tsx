import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Route, RouterProvider } from "react-router";
import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/watch/:videoId">{/* <WatchingVideo /> */}</Route>
    </Route>
  )
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>
);
