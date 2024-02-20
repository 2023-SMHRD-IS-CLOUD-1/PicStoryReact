import PhotoAlbum from "./components/PhotoAlbum";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import JoinPage from "./components/JoinPage";
import MyInfoPage from "./components/MyInfoPage";
import AccountPage from "./components/AccountPage";
import { Route, Routes } from "react-router-dom";
import AccountCheck from "./components/AccountCheck";
import PayPage from "./components/PayPage";
import axios from "axios";

import './App.css'
function App() {

  return (

    <Routes>
      <Route path="/" element={<HomePage/>}></Route>
      <Route path="/login" element={<LoginPage/>}></Route>
      <Route path="/join" element={<JoinPage/>}></Route>
      <Route path="/photoAlbum" element={<PhotoAlbum/>}></Route>
      <Route path="/myinfo" element={<MyInfoPage/>}></Route>
      <Route path="/account" element={<AccountPage/>}></Route>
      <Route path="/accountCheck" element={<AccountCheck/>}></Route>
      <Route path="/Payment" element={<PayPage/>}></Route>
    </Routes>
  );

}

export default App;
