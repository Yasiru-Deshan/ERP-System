import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function CustomerTable() {
  let [customers, setCustomers] = useState([]);
  let [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/customers")
      .then((response) => {
        setCustomers(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  //search filter
  if (search.length > 0) {
    customers = customers.filter((i) => {
      return i.firstName.toLowerCase().match(search.toLowerCase());
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
    for (let j = 0; customers.length > j; j++) {
      bodyData.push([
        customers[j].firstName,
        customers[j].lastName,
        customers[j].mobile,
        customers[j].city,
        customers[j].zip,
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
      head: [
        [
          "First Name",
          "Last Name",
          "Mobile",
          "City",
          "Zip",
        ],
      ],
      body: bodyData,
    });
    doc.save("Customer_Report.pdf");
  };

  return (
    <div className="container" style={{ margin: "100px 0px 20px 100px" }}>
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

      <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "600" }}>
        Customer Table
      </h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.email}</td>
              <td>{customer.city || "N/A"}</td>
              <td>{customer.mobile || "N/A"}</td>
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
  );
}

export default CustomerTable;
