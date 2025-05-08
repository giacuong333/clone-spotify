import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import Auth from "./contexts/Auth";
import Toast from "./components/Toast";
import Axios from "./contexts/Axios";
import PlayerProvider from "./contexts/Player";
import SongProvider from "./contexts/Song";
import UserProvider from "./contexts/User";
import ChatProvider from "./contexts/Chat";
import GenreProvider from "./contexts/genre";
import SearchProvider from "./contexts/Search";

const App = () => {
	return (
		<BrowserRouter>
			<Axios>
				<Auth>
					<PlayerProvider>
						<UserProvider>
							<SongProvider>
								<GenreProvider>
									<SearchProvider>
										<ChatProvider>
											<Toast />
											<AppRoutes />
										</ChatProvider>
									</SearchProvider>
								</GenreProvider>
							</SongProvider>
						</UserProvider>
					</PlayerProvider>
				</Auth>
			</Axios>
		</BrowserRouter>
	);
};

export default App;
