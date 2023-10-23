import React, { useEffect, useContext } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import "../Card/Card.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const CartItem = (props) => {
  const auth = useContext(AuthContext);
  const {
    id,
    inv_pro_name,
    sku,
    inv_pro_description,
    inv_pro_cost,
    inv_pro_selling,
    inv_pro_warranty,
    inv_pro_quantity,
    inv_pro_reorder_level,
  } = props;

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  const removeItem = async (itemId) => {
    const cartItem = {
      inventoryItemId: itemId,
    };

    const config = {
      headers: {
        "x-auth-token": auth.token,
        "Content-Type": "application/json",
      },
    };

    try {
      const update = await axios.put(
        "http://localhost:5000/api/inventory/remove_item",
        cartItem,
        config
      );

      if (update.data.success) {
        window.alert("Item removed from the cart");
        window.location.reload();
      } else {
        console.error("Item removal failed. Server response:", update.data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="card">
      <img
        src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwbGUlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D"
        alt=""
      />
      <div className="card-content">
        <h2 style={{ padding: "10px" }}>{inv_pro_name}</h2>
        {/* <div className="description-row">
          <p>{inv_pro_description}</p>
        </div> */}
        <div className="content-row">
          <p>{inv_pro_selling}</p>
          <p>{sku}</p>
          <button className="btn btn-danger" onClick={() => removeItem(id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
