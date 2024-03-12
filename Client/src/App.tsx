import { useRoutes } from "react-router";
import AppLayout from "./layout";
import routes from "./config/routes";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import "react-toastify/dist/ReactToastify.css";
import "./variables.scss";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppLayout>{useRoutes(routes)}</AppLayout>
      </PersistGate>
    </Provider>
  );
}

export default App;
