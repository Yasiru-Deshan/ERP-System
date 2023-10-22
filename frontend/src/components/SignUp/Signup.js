import React, { useRef, useContext } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { NotificationContext } from "../../context/NotificationContext";

const Signup = () => {
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext);
  const fname = useRef();
  const lname = useRef();
  const password = useRef();
  const email = useRef();
  const role = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    let newStaff;

    const config = {
      headers: {
        "x-auth-token": `${auth.token}`,
        "Content-Type": "application/json",
      },
    };

    const newMember = {
      firstName: fname.current.value,
      lastName: lname.current.value,
      password: password.current.value,
      email: email.current.value,
      role: role.current.value,
    };

    try {
      newStaff = await axios.post(
        "http://localhost:5000/api/auth/signup",
        newMember,
        config
      );
      if (newStaff) {
        //    <Redirect to='/login' />
        window.alert("User Added Successfully!");
      } else {
        notification.showNotification(
          "something went wrong. please try again",
          true
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
           background:
          "linear-gradient(to left,#7F00FF, #E100FF)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      }}
    >
      <div className="row justify-content-center">
        <Card
          className="text-center"
          style={{
            width: "28rem",
            marginTop: "10rem",
            marginBottom: "5rem",
            boxShadow: "5px 8px 35px ",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <Card.Body>
            <Card.Title style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Add New Staff Member
            </Card.Title>

            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  //value={email}
                  ref={email}
                  required
                  placeholder="john@gmail.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fname">First Name</label>
                <input
                  name="password"
                  className="form-control"
                  id="password"
                  //value={password}
                  ref={fname}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lname">Last Name</label>
                <input
                  name="password"
                  className="form-control"
                  id="password"
                  //value={password}
                  ref={lname}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password">password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  //value={password}
                  ref={password}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role">Role</label>
                <select className="form-control" ref={role}>
                  <option>Worker</option>
                  <option>Manager</option>
                </select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary w-100">
                  Create Account
                </button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
