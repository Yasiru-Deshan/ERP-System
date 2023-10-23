import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Modal from "react-modal";

const OrderItemCard = styled.div`
  border: 1px solid #e0e0e0;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  ${'' /* margin: 0px 0px -80px 0px; */}
`;

const ItemId = styled.span`
  font-weight: 400;
  font-size: 24px;
  color: #333;
`;

const ItemPrice = styled.span`
  font-weight: 600;
  font-size: 36px;
  margin-inline: 20px;
  color: #008cba;
`;

const ItemStatus = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.status === "Delivered"
      ? "#4CAF50"
      : props.status === "Pending"
      ? "#FFC107"
      : "#FF5722"};
  color: #fff;
  font-size: 12px;
  text-transform: uppercase;
`;

const OrderItem = ({ id, price, status }) => {

      const auth = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [orderStatus, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderPrice, setPrice] = useState(null);

const config = {
    headers: {
    "x-auth-token": `${auth.token}`,
    "Content-Type": "application/json",
    },
};
  const getOrderByID = async (orderId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/order/${orderId}`,
        config
      );
      setPrice(res.data.price);
      setOrderId(res.data._id);
      setStatus(res.data.status);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
    }
  };

  return (
    <div>
      <div style={{ padding: "50px" }}>
        <Modal
          isOpen={modal}
          onRequestClose={() => setModal(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(49, 49, 49, 0.8)",
              width: "100%",
              height: "100%",
            },

            content: {
              width: "calc(200px + 15vw)",
              height: "300px",
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
          <h1 style={{ textAlign: "center" }}>Order Details</h1>
          <div
            className="row  text-center mb-0 justify-content-center"
            style={{ width: "60%", margin: "auto" }}
          >
            <p>Order Id : {orderId}</p>
            <p>Order price : {orderPrice}</p>
            <p>Order Status : {orderStatus}</p>
          </div>
        </Modal>
      </div>
      <OrderItemCard>
        <ItemId>Order ID: {id}</ItemId>
        <ItemPrice>Price: Rs{price}</ItemPrice>
        <ItemStatus status={status}>{status}</ItemStatus>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {getOrderByID(id); setModal(true);}}
        >
          view
        </button>
      </OrderItemCard>
    </div>
  );
};

export default OrderItem;
