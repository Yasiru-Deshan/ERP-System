import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import "./Cart.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Cart = () => {

    const auth = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!auth.token) {
        setError("Please log in to add items to cart.");
        return;
      }

      const config = {
        headers: {
          "x-auth-token": `${auth.token}`,
          "Content-Type": "application/json",
        },
      };

      const getItems = () => {
        axios.get("http://localhost:5000/api/inventory", config).then((res) => {
          setItems(res.data.cart_items);
        });
      };

      getItems();

    }, [auth.token]);

      const createOrder = async (e) => {
          let update;

          e.preventDefault();

          const config = {
            headers: {
              "x-auth-token": `${auth.token}`,
              "Content-Type": "application/json",
            },
          };

          try {
            update = await axios.post(
              "http://localhost:5000/api/order/new_order",
              {},
              config
            );

            if (update) {
              window.alert("Order Created Successfully");
            }
          } catch (err) {
            console.log(err);
          }
      };

  return (
    <div>
        <div className="cartHeader">My Cart</div>
        {auth.token &&
        <div className="checkout-button-area">
          <div>TOTAL : {}</div>
          <button className="btn btn-primary" onClick={createOrder}>Checkout</button>
        </div>}
        <div className="searchContainer">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search for..."
            />
            <span class="input-group-btn">
              <button class="btn btn-search" type="button">
                <i class="fa fa-search fa-fw"></i> Search
              </button>
            </span>
          </div>
        </div>

        <div>
          {error && <div className="error">{error}
        </div>}</div> 

        <div className="cardContainer">
          {items.map((item) => (
            <Card
              key={item._id}
              inv_pro_name={item.inv_pro_name}
              sku={item.sku}
              inv_pro_description={item.inv_pro_description}
              inv_pro_cost={item.inv_pro_cost}
              inv_pro_selling={item.inv_pro_selling}
              inv_pro_warranty={item.inv_pro_warranty}
              inv_pro_quantity={item.inv_pro_quantity}
              inv_pro_reorder_level={item.inv_pro_reorder_level}
            />
          ))}
        </div>
    </div>
  );
};

export default Cart;
