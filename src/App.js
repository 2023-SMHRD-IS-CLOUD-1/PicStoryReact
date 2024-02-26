import PhotoAlbum from "./components/PhotoAlbum";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import JoinPage from "./components/JoinPage";
import MyInfoPage from "./components/MyInfoPage";
import AccountPage from "./components/AccountPage";
import { Route, Routes } from "react-router-dom";
import AccountCheck from "./components/AccountCheck";
import PayPage from "./components/PayPage";
import FavorPage from "./components/FavorPage";

import './App.css'
import { UserContext } from "./contexts/User";
import { useState } from "react";
function App() {

  const [selectedTagList, setSelectedTagList] = useState([]);
  const [showSelectedTagList, setShowSelectedTagList] = useState([]);
  const [tempList, setTempList] = useState([]);
  const [allMyFolder, setAllMyFolder] = useState([]);
  const [selecteMydFolder, setSelectedMyFolder] = useState([]);
  const [loadPhotosNum, setLoadPhotosNum] = useState([]);
  const [checkPhotoNum, setCheckPhotoNum] = useState([]);

  return (
    <UserContext.Provider value={{ checkPhotoNum, setCheckPhotoNum, loadPhotosNum, setLoadPhotosNum, selecteMydFolder, setSelectedMyFolder, allMyFolder, setAllMyFolder, tempList, setTempList, selectedTagList, setSelectedTagList, showSelectedTagList, setShowSelectedTagList }}>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/join" element={<JoinPage />}></Route>
        <Route path="/photoAlbum" element={<PhotoAlbum />}></Route>
        <Route path="/myinfo" element={<MyInfoPage />}></Route>
        <Route path="/account" element={<AccountPage />}></Route>
        <Route path="/accountCheck" element={<AccountCheck />}></Route>
        <Route path="/Payment" element={<PayPage />}></Route>
        <Route path="/favorPage" element={<FavorPage />}></Route>
      </Routes>
    </UserContext.Provider>
  );

}

export default App;
