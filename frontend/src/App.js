import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./Hooks/authHook";
import { AuthContext } from "./Context/authContext";

//Containers
import Layout from "./Containers/Layout/Layout";
import Home from "./Containers/Home/Home";
import Login from "./Containers/Login/Login";
import SignUp from "./Containers/Signup/Signup";
import Posts from "./Containers/Posts/Posts";
import Menu from "./Containers/Menu/Menu";
import UserProfile from "./Containers/UserProfile/UserProfile";
import UpdateProfile from "./Containers/UpdateProfile/UpdateProfile";
import CommentPost from "./Containers/CommentPost/CommentPost";
import NewPost from "./Containers/NewPost/NewPost";
import UpdatePost from "./Containers/UpdatePost/UpdatePost";
import UpdateComment from "./Containers/UpdateComment/UpdateComment";

import "./App.css";

const App = () => {
  const { userId, token, account, login, logout } = useAuth();

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/post" element={<Posts />} />
      <Route path="/post/new" element={<NewPost />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/user/:id" element={<UserProfile />} />
      <Route path="/user/:id/update" element={<UpdateProfile />} />
      <Route path="/post/:id" element={<CommentPost />} />
      <Route path="/post/update/:id" element={<UpdatePost />} />
      <Route path="/comment/update/:id" element={<UpdateComment />} />
    </Routes>
  );

  
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token: token,
        account: account,
        login: login,
        logout: logout
      }}>
        <Layout>{routes}</Layout>
      </AuthContext.Provider>
  );
};

export default App;