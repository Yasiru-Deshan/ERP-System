import React, { useEffect, useContext, useState } from "react";
import "./Order.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import OrderItem from "./OrderItem";

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
    </div>
  );
};

export default Order;
