import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GameList from "./pages/GameList";
import CreateGame from "./pages/CreateGame";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProfileEditForm from "./components/ProfileEditForm";
import ProfilePage from "./components/ProfilePage";
import GameEditForm from "./pages/GameEditForm";

function App({router: Router = BrowserRouter}) {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/create" element={<CreateGame />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/edit" element={<ProfileEditForm />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/games/:id/edit" element={<GameEditForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
