import { useRoutes } from "react-router";
import AppLayout from "./layout";
import routes from "./config/routes";

function App() {
  return (
    <>
      <AppLayout>{useRoutes(routes)}</AppLayout>
    </>
  );
}

export default App;
