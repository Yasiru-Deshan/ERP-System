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
    inv_img
  } = props;

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

 const handleRemoveClick = () => {
   removeItem(id);
 };

 const removeItem = async (itemId) => {
   console.log("Token from context:", auth.token);
   console.log("Item ID to remove:", itemId);

   const cartItem = {
     itemIdToRemove: itemId,
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
       JSON.stringify(cartItem),
       config
     );

     if (update) {
       window.alert("Item removed from the cart");

       window.location.reload();
     } else {
       console.error("Item removal failed. Server response:", update.data);
     }
   } catch (error) {
     console.error(
       "An error occurred:",
       error.response ? error.response.data : error
     );
   }
 };


  return (
    <div className="card">
      <img src={inv_img} alt="" />
      <div className="card-content">
        <h2 style={{ padding: "10px", height: "60px" }}>{inv_pro_name}</h2>
        <div className="content-row">
          <p>{inv_pro_selling}</p>
          <p>{sku}</p>
          <button className="btn btn-danger" onClick={handleRemoveClick}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
