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
import PlaylistProvider from "./contexts/playlist";
const App = () => {
  return (
    <BrowserRouter>
      <Axios>
        <Auth>
          <PlayerProvider>
            <UserProvider>
              <SongProvider>
                <GenreProvider>
                  <PlaylistProvider>
                    <SearchProvider>
                      <ChatProvider>
                        <Toast />
                        <AppRoutes />
                      </ChatProvider>
                    </SearchProvider>
                  </PlaylistProvider>
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
