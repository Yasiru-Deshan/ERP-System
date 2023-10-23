import React, { useState, useEffect, useContext } from "react";
import Card from "../Card/Card";
import "./Home.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Home = () => {
  const auth = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        "x-auth-token": `${auth.token}`,
        "Content-Type": "application/json",
      },
    };

    const getItems = () => {
      axios
        .get("http://localhost:5000/api/inventory/all", config)
        .then((res) => {
          setItems(res.data.inventories);
        });
    };

    getItems();
  }, [auth.token]);

  return (
    <div style={{padding: "100px"}}>
      <div className="searchContainer">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Search for..." />
          <span class="input-group-btn">
            <button class="btn btn-search" type="button">
              <i class="fa fa-search fa-fw"></i> Search
            </button>
          </span>
        </div>
      </div>

      <div className="homeContainer">
        {items.map((item) => (
          <Card
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
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
