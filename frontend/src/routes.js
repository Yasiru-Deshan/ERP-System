import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/Signup";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import Order from "./components/Order/Order";
import Profile from "./components/Profile/Profile";
import Job from "./components/Warranty/Job/Job";
import JobList from "./components/Warranty/JobList/JobList";

const getRoutes = (role, token) => {
  let routes;
  if (token && role === "sm") {
    routes = (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<JobList />} />
        <Route path="/new" element={<Job />} />
      </Routes>
    );
  }  else if (token && role === "csr") {
    routes = (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<JobList />} />
        <Route path="/new" element={<Job />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    );
  }
  return routes;
};

export default getRoutes;
