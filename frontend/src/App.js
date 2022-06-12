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

import "./Styles/App.css";

const App = () => {
  const { userId, token, account, login, logout } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/post" exact component={Posts} />
        <Route path="/post/new" component={NewPost} />
        <Route path="/menu" component={Menu} />
        <Route path="/user/:id" component={UserProfile} />
        <Route path="/user/:id/update" component={UpdateProfile} />
        <Route path="/post/:id" component={CommentPost} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    );
  }
  
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