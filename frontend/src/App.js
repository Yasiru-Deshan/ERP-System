import React, { useCallback, useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Navigate } from "react-router-dom";
import Notification from "./components/Notification/Notification";
import { AuthContext } from "./context/AuthContext";
import { NotificationContext } from "./context/NotificationContext";
import Footer from "./components/Footer/index";
import getRoutes from "./routes";
import NavBar from "./components/Navbar/index";
//require("dotenv").config();

function App() {
  const [token, setToken] = useState();
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [notify, setNotify] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);

  const clearNotification = useCallback(() => {
    setNotify(false);
    setMessage(null);
    setError(false);
  }, []);
  const setNotification = useCallback(
    (msg, error) => {
      setMessage(msg);
      setError(error);
      setNotify(true);
      setTimeout(() => {
        clearNotification();
      }, 5000);
    },
    [clearNotification]
  );

  const reloadUser = useCallback((user) => {
    const storedData = JSON.parse(localStorage.getItem("authData"));
    localStorage.setItem(
      "authData",
      JSON.stringify({
        token: storedData.token,
        name: storedData.name,
        id: storedData.id,
        role: storedData.role,
        user,
      })
    );

    setUser(user);
  }, []);
  const authenticate = useCallback((token, name, id, role, user) => {
    setToken(token);
    setName(name);
    setUserId(id);

    setUser(user);
    setRole(role);
    localStorage.setItem(
      "authData",
      JSON.stringify({
        token,
        name,
        id,
        role,
        user,
      })
    );
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setName(null);
    setUserId(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem("authData");
    localStorage.clear();
    return <Navigate to="/login" replace={true} />;
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("authData"));
    if (storedData && storedData.token) {
      authenticate(
        storedData.token,
        storedData.name,
        storedData.id,
        storedData.role,
        storedData.user
      );
    }
    setIsLoading(false);
  }, [authenticate]);

  let routes = getRoutes(role, token);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        fullName: name,
        userId: userId,
        role: role,
        user,
        authenticate,
        logout: logout,
        reloadUser,
      }}
    >
      <NotificationContext.Provider
        value={{
          notify,
          message,
          error,
          showNotification: setNotification,
          clearNotification: clearNotification,
        }}
      >
        <BrowserRouter>
          <div className="app">
            {!isLoading && <NavBar />}
            <Notification />

            <div>{!isLoading && routes}</div>
           
          </div>
        </BrowserRouter>
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
