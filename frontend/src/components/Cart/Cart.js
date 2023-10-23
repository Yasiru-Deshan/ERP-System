import React, { useState, useEffect, useContext } from "react";
import "./Cart.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import CartItem from "./CartItem";

const Cart = () => {

    const auth = useContext(AuthContext);
    let [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [totalSelling, setTotalSelling] = useState(0);
    let [search, setSearch] = useState("");

useEffect(() => {
  if (!auth.token) {
    setError("Please log in to add items to the cart.");
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

useEffect(() => {
  
  const calculateTotalSelling = () => {
    const total = items.reduce((acc, item) => acc + item.inv_pro_selling, 0);
    setTotalSelling(total);
  };

  calculateTotalSelling();
}, [items]);


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

  if (search.length > 0) {
    items = items.filter((i) => {
      return i.inv_pro_name.toLowerCase().match(search.toLowerCase());
    });
  }

  return (
    <div>
      <div className="cartHeader">My Cart</div>
      {auth.token && (
        <div className="checkout-button-area">
          <div>TOTAL : {totalSelling}</div>
          <button className="btn btn-primary" onClick={createOrder}>
            Checkout
          </button>
        </div>
      )}
      <div className="searchContainer">
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

      <div>{error && <div className="error">{error}</div>}</div>

      <div className="cardContainer">
        {items.map((item) => (
          <CartItem
            key={item._id}
            id={item._id}
            inv_pro_name={item.inv_pro_name}
            sku={item.sku}
            inv_pro_description={item.inv_pro_description}
            inv_pro_cost={item.inv_pro_cost}
            inv_pro_selling={item.inv_pro_selling}
            inv_pro_warranty={item.inv_pro_warranty}
            inv_pro_quantity={item.inv_pro_quantity}
            inv_pro_reorder_level={item.inv_pro_reorder_level}
            inv_img={item.inv_img}
          />
        ))}
      </div>
    </div>
  );
};

export default Cart;
