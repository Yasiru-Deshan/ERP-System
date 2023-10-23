import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { Form } from "react-bootstrap";

const JobList = () => {
  const auth = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [mdal, setModal] = useState(false);
  const [sttus, setStatus] = useState();
  const [jobId, setJobID] = useState();

    const editHandler = async (e) => {
      let update;

      e.preventDefault();
      const updatedJob = {
        status: sttus,
        id: jobId,
      };

      const config = {
        headers: {
          "x-auth-token": `${auth.token}`,
          "Content-Type": "application/json",
        },
      };

      try {
        update = await axios.put(
          `http://localhost:5000/api/warranty/edit`,
          updatedJob,
          config
        );

        if (update) {
          window.alert("Job has been updated");
          setModal(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    
  useEffect(() => {

    const config = {
      headers: {
        "x-auth-token": `${auth.token}`,
        "Content-Type": "application/json",
      },
    };

    const getItems = () => {
      axios.get("http://localhost:5000/api/warranty", config).then((res) => {
        setJobs(res.data);
      });
    };

    getItems();
  }, [auth.token, mdal]);

  const deleteJob = async (id) => {
    const body = {
      id: id,
    };

    console.log(body);

    const config = {
      headers: {
        "x-auth-token": auth.token, 
      },
    };

    if (window.confirm("Are you sure about deleting this job?")) {
      try {
        const response = await axios.delete(
          "http://localhost:5000/api/warranty/delete",
          {
            data: body, 
            headers: config.headers,
          }
        );

        if (response.status === 200) {
          window.alert("Job has been deleted");
          window.location.reload();
        } else {
          window.alert("Something went wrong! Please try again.");
        }
      } catch (error) {
        console.error(error);
        window.alert("An error occurred. Please try again later.");
      }
    }
  };

    return (
      <div style={{ padding: "150px 50px 20px 50px" }}>
        <Modal
          isOpen={mdal}
          onRequestClose={() => setModal(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(49, 49, 49, 0.8)",
              width: "100%",
              height: "100%",
            },

            content: {
              width: "calc(200px + 15vw)",
              height: "100%",
              borderRadius: "5px",
              color: "black",
              background: "white",
              margin: "0 auto",
              marginTop: "70px",
            },
          }}
        >
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setModal(false);
            }}
          ></button>
          <h1 style={{ textAlign: "center" }}>Edit Job</h1>

          <Form onSubmit={editHandler}>
            <Form.Label style={{ color: "blue" }}>Job Id</Form.Label>
            <Form.Control
              type="text"
              defaultValue={jobId}
              onChange={(e) => {
                setJobID(e.target.value);
              }}
            />

            <Form.Label style={{ color: "blue" }}>Status</Form.Label>
            <Form.Control
              type="text"
              defaultValue={sttus}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            />

            <button
              type="submit"
              style={{
                fontSize: "calc(0.5vw + 12px)",
                borderRadius: "3px",
                padding: "calc(10px + 1vw)",
                color: "#fff",
                background:
                  "linear-gradient(to right, #12c2e9, #c471ed, #f64f59)",
                border: "none",
                width: "100%",
                marginTop: "10px",
                fontStyle: "bold",
              }}
            >
              Done
            </button>
          </Form>
        </Modal>

        <div
          style={{
            textAlign: "center",
            fontSize: "30px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Jobs
        </div>
        {auth.role === "csr" && (
        <div style={{ textAlign: "right", padding: "0px 0px 20px" }}>
          <Link to="/new">
            <button className="btn btn-success">Add New Job</button>
          </Link>
        </div>
        )}
        {jobs.length == 0 ? 
        <div style={{textAlign:'center'}}>
            <p>No jobs yet</p>
        </div> : 
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Customer Mobile</th>
              <th>Device</th>
              <th>Error Type</th>
              <th>Error Description</th>
              <th>Job Type</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((warranty, index) => (
              <tr key={index}>
                <td>{warranty.cus_name}</td>
                <td>{warranty.cus_mobile}</td>
                <td>{warranty.device}</td>
                <td>{warranty.error_type}</td>
                <td>{warranty.error_description}</td>
                <td>{warranty.job_type}</td>
                <td>{warranty.status}</td>
                <td>{warranty.created_by.name}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setJobID(warranty._id);
                      setStatus(warranty.status);
                      setModal(true);
                    }}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => deleteJob(warranty._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        }
      </div>
    );
}

export default JobList;
