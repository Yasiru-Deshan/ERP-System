import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { Form } from "react-bootstrap";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const JobList = () => {
  const auth = useContext(AuthContext);
  let [jobs, setJobs] = useState([]);
  const [mdal, setModal] = useState(false);
  const [sttus, setStatus] = useState();
  const [jobId, setJobID] = useState();
  let [search, setSearch] = useState("");

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
        "x-auth-token": auth.token, // No need for `${}` here
        "Content-Type": "application/json",
      },
    };

    const getItems = () => {
      axios
        .get("http://localhost:5000/api/warranty", config)
        .then((res) => {
          setJobs(res.data);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    };

    getItems();
  }, [auth.token, mdal]); // Fixed typo here

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

  //search filter
  if (search.length > 0) {
    jobs = jobs.filter((i) => {
      return i.status.toLowerCase().match(search.toLowerCase());
    });
  }

  //Generate Report
  const pdf = () => {
    const loading = document.getElementById("loading");
    loading.style.display = ""; 
    const dwnIcon = document.getElementById("dwn-icon");
    dwnIcon.style.display = "none";

    setTimeout(() => {
      loading.style.display = "none";
      dwnIcon.style.display = "";
    }, 1300); 

    let bodyData = [];
    for (let j = 0; jobs.length > j; j++) {
      bodyData.push([
        jobs[j].cus_name,
        jobs[j].cus_mobile,
        jobs[j].device,
        jobs[j].error_type,
        jobs[j].error_description,
        jobs[j].job_type,
        jobs[j].status,
      ]);
    }

    const doc = new jsPDF({ orientation: "portrait" });
    var time = new Date().toLocaleString();
    doc.setFontSize(20);
    doc.text(`Job Report`, 105, 13, null, null, "center");
    doc.setFontSize(10);
    doc.text(`(Generated on ${time})`, 105, 17, null, null, "center");
    doc.setFontSize(12);
    doc.text(
      "ERPSYSTEM © 2021 All rights reserved.",
      105,
      22,
      null,
      null,
      "center"
    );

    doc.autoTable({
      theme: "grid",
      styles: { halign: "center" },
      headStyles: { fillColor: [71, 201, 76] },
      startY: 27,
      head: [["Customer Name", "Mobile", "Device Type", "Error Type", "Error Description", "Job Type", "Status"]],
      body: bodyData,
    });
    doc.save("Job_Report.pdf");
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
      <div style={{ margin: "10px 20px 40px 20px" }}>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Search for..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
          />
          <span class="input-group-btn">
            <button class="btn btn-search" type="button">
              <i class="fa fa-search fa-fw"></i> Search
            </button>
          </span>
        </div>
      </div>
      {auth.role === "csr" && (
        <div style={{ textAlign: "right", padding: "0px 0px 20px" }}>
          <Link to="/new">
            <button className="btn btn-success">Add New Job</button>
          </Link>
        </div>
      )}
      {jobs.length == 0 ? (
        <div style={{ textAlign: "center" }}>
          <p>No jobs yet</p>
        </div>
      ) : (
        <div>
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
        <button
            className="newButton"
            style={{
                fontSize: "calc(0.2vw + 12px)",
                borderRadius: "3px",
                padding: "calc(15px + 1vw)",
                color: "#fff",
                backgroundColor: "#01bf71",
                border: "none",
                marginLeft: "20px",
            }}
            onClick={pdf}
            >
            <svg
                id="dwn-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cloud-arrow-down-fill"
                viewBox="0 0 16 16"
            >
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z" />
            </svg>
            <span
                className="spinner-border spinner-border-sm"
                id="loading"
                role="status"
                aria-hidden="true"
                style={{ display: "none" }}
            ></span>{" "}
            Generate Report
            </button>
            </div>
      )}

    </div>
  );
}

export default JobList;
