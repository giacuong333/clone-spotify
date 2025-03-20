import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import Search from "./contexts/Search";
import Auth from "./contexts/Auth";
import Toast from "./components/Toast";
import Axios from "./contexts/Axios";
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Axios>
          <Auth>
            <Search>
              <AppRoutes />
              <Toast />
            </Search>
          </Auth>
        </Axios>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
