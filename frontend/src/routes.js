import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/Signup";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";

const getRoutes = (role, token) => {
  let routes;
  if (token && role === "admin") {
    routes = (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signin" element={<SignUp />} />
            </Routes>
    );
  }  else if (token && role === "Manager") {
    routes = (
      <Routes>
        <Route path="/">{<Login />}</Route>
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    );
  }
  return routes;
};

export default getRoutes;
