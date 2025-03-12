import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import Search from "./contexts/Search";
import Auth from "./contexts/Auth";
import Toast from "./components/Toast";

const App = () => {
  return (
    <BrowserRouter>
      <Auth>
        <Search>
          <AppRoutes />
          <Toast />
        </Search>
      </Auth>
    </BrowserRouter>
  );
};

export default App;
