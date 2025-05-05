import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import Auth, { useAuth } from "./contexts/Auth";
import Toast from "./components/Toast";
import Axios from "./contexts/Axios";
import PlayerProvider from "./contexts/Player";
import SongProvider from "./contexts/Song";
import UserProvider from "./contexts/User";
import ChatProvider from "./contexts/Chat";

const App = () => {
	return (
		<BrowserRouter>
			<Axios>
				<Auth>
					<PlayerProvider>
						<UserProvider>
							<SongProvider>
								<ChatProvider>
									<AppRoutes />
									<Toast />
								</ChatProvider>
							</SongProvider>
						</UserProvider>
					</PlayerProvider>
				</Auth>
			</Axios>
		</BrowserRouter>
	);
};

export default App;
