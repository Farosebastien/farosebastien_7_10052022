import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useAuth } from "./Hooks/authHook";
import { AuthContext } from "./Context/authContext";

//Containers


const App = () => {
  const { userId, token, account, login, logout } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/posts" exact component={Posts} />
        <Route path="/posts/new" exact component={NewPost} />
        <Route path="/menu" exact component={Menu} />
        <Route path="/profile/:id" exact component={UserProfile} />
        <Route path="/profile/:id/update" exact component={UpdateProfile} />
        <Route path="/posts/:id" exact component={CommentPost} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
      </Switch>
    );
  }
  
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        account: account,
        login: login,
        logout: logout
      }}>
        <Layout>{routes}</Layout>
      </AuthContext.Provider>
  );
};

export default App;