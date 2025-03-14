import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import Search from "./contexts/Search";
import Auth from "./contexts/Auth";
import Toast from "./components/Toast";
import Axios from "./contexts/Axios";

const App = () => {
  return (
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
  );
};

export default App;
