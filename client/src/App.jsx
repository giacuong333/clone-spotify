import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import Auth from "./contexts/Auth";
import Toast from "./components/Toast";
import Axios from "./contexts/Axios";
import PlayerProvider from "./contexts/Player";
import SongProvider from "./contexts/Song";

const App = () => {
	return (
		<BrowserRouter>
			<Axios>
				<Auth>
					<PlayerProvider>
						<SongProvider>
							<AppRoutes />
							<Toast />
						</SongProvider>
					</PlayerProvider>
				</Auth>
			</Axios>
		</BrowserRouter>
	);
};

export default App;
