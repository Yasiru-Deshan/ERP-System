import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import Card from "react-bootstrap/Card";

const Job = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const name = useRef();
    const device = useRef();
    const error = useRef();
    const description = useRef();
    const mobile = useRef();
    const job_type = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    let newWarranty;

        const config = {
        headers: {
            "x-auth-token": `${auth.token}`,
            "Content-Type": "application/json",
        },
        };

        const newJob = {
        cus_name: name.current.value,
        device: device.current.value,
        error_type: error.current.value,
        error_description: description.current.value,
        cus_mobile: mobile.current.value,
        job_type: job_type.current.value,
        };

        try {
        newWarranty = await axios.post(
            "http://localhost:5000/api/warranty/new",
            newJob,
            config,
        );
        if (newWarranty) {
            window.alert("Job created successfully!");
        } else {
            window.alert(
            "something went wrong. please try again",
            true
            );
        }
        } catch (err) {
        console.log(err);
        }
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
            height: "100%",
          }}
        >
          <Card.Body>
            <Card.Title style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Create a Job
            </Card.Title>

            <form onSubmit={submitHandler}>

              <div className="mb-3">
                <label htmlFor="fname">Customer Name</label>
                <input
                  name="fname"
                  className="form-control"
                  id="fname"
                  ref={name}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mobile">Mobile</label>
                <input
                  type="number"
                  name="mobile"
                  className="form-control"
                  id="mobile"
                  ref={mobile}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="device">Device</label>
                <input
                  type="text"
                  name="device"
                  className="form-control"
                  id="device"
                  ref={device}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="zip">Error Type</label>
                <input
                  type="text"
                  name="zip"
                  className="form-control"
                  id="zip"
                  ref={error}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="zip">Error Description</label>
                <input
                  type="text"
                  name="zip"
                  className="form-control"
                  id="zip"
                  ref={description}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="zip">Job Type</label>
                <input
                  type="text"
                  name="zip"
                  className="form-control"
                  id="zip"
                  ref={job_type}
                  required
                />
              </div>
              <div className="mb-3">
                <button className="btn btn-primary w-100">
                  Create Job
                </button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Job;
