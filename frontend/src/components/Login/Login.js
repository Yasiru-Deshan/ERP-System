import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";
import { Navigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext);
  const navigate = useNavigate();
  const [user, setUserData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/auth/login`,
        body,
        {
          ContentType: "application/json",
        }
      );

      if (response.data.token != null) {
        auth.authenticate(
          response.data.token,
          response.data.firstName + " " + response.data.lastName,
          response.data.id,
          response.data.role,
          response.data.user
        );
        navigate("/home");  
      } else {
        notification.showNotification("please check your credentials", true);
      }
    } catch (error) {
      notification.showNotification("Server error please reload", true);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div>
      <div className="row justify-content-center">
        <Card
          className="text-center"
          style={{
            width: "28rem",
            marginTop: "10rem",
            marginBottom: "5rem",
            borderRadius: "20px",
            padding: "30px",
            height: "100%"
          }}
        >
          <Card.Body>
            <Card.Title style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Log In
            </Card.Title>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="john@gmail.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <button className="btn btn-primary w-100">Login</button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
