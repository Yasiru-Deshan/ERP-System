import React, { useState, useEffect } from "react";
import axios from "axios";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);

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

  return (
    <div className="container" style={{margin:"100px 0px 20px 100px"}}>
      <h2 style={{textAlign:"center", fontSize:"32px", fontWeight:"600"}}>Customer Table</h2>
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
    </div>
  );
}

export default CustomerTable;
