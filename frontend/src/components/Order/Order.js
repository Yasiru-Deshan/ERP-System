import React, { useEffect, useContext, useState } from "react";
import "./Order.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import OrderItem from "./OrderItem";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Order = () => {
  const auth = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.token) {
      setError("No orders yet.");
      return;
    }

    const config = {
      headers: {
        "x-auth-token": `${auth.token}`,
        "Content-Type": "application/json",
      },
    };

    const getItems = () => {
      axios.get("http://localhost:5000/api/order/all", config).then((res) => {
        setItems(res.data.orders);
      });
    };

    getItems();
  }, [auth.token]);

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
    for (let j = 0; items.length > j; j++) {
      bodyData.push([
        items[j]._id,
        items[j].price,
        items[j].status,
      ]);
    }

    const doc = new jsPDF({ orientation: "portrait" });
    var time = new Date().toLocaleString();
    doc.setFontSize(20);
    doc.text(`Order Report`, 105, 13, null, null, "center");
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
          "Order ID",
          "Total",
          "Status",
        ],
      ],
      body: bodyData,
    });
    doc.save("Order_Report.pdf");
  };

  return (
    <div>
      <div className="orderHeader">My Orders</div>
      <div>{error && <div className="error">{error}</div>}</div>
      <div className="orderContainer">
        {items.map((item) => (
          <OrderItem
            key={item._id}
            id={item._id}
            price={item.price}
            status={item.status}
          />
        ))}
      </div>
      <button
        className="newButton"
        style={{
          fontSize: "calc(0.2vw + 12px)",
          borderRadius: "3px",
          padding: "calc(15px + 1vw)",
          color: "#fff",
          backgroundColor: "#01bf71",
          border: "none",
          marginLeft: "50px",
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
};

export default Order;
