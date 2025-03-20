import { configureStore } from "@reduxjs/toolkit";
import songReducer from "../song/reducer";

export default configureStore({
  reducer: {
    song: songReducer,
  },
});
