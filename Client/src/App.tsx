import { useRoutes } from "react-router";
import AppLayout from "./layout";
import routes from "./config/routes";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <AppLayout>{useRoutes(routes)}</AppLayout>
    </Provider>
  );
}

export default App;
