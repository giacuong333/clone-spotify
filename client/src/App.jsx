import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import Search from "./contexts/Search";

const App = () => {
  return (
    <BrowserRouter>
      <Search>
        <AppRoutes />
      </Search>
    </BrowserRouter>
  );
};

export default App;
